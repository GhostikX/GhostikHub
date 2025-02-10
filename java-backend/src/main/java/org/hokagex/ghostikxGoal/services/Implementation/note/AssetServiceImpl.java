package org.hokagex.ghostikxGoal.services.Implementation.note;

import org.hibernate.SessionException;
import org.hokagex.ghostikxGoal.dto.note.AssetDto;
import org.hokagex.ghostikxGoal.exceptions.FileUploadException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.models.note.Asset;
import org.hokagex.ghostikxGoal.models.note.Note;
import org.hokagex.ghostikxGoal.repositories.AssetRepository;
import org.hokagex.ghostikxGoal.repositories.NoteRepository;
import org.hokagex.ghostikxGoal.repositories.UsersRepository;
import org.hokagex.ghostikxGoal.services.FileService;
import org.hokagex.ghostikxGoal.services.noteServices.AssetService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AssetServiceImpl implements AssetService {

    private final ModelMapper modelMapper;
    private final AssetRepository assetRepository;
    private final NoteRepository noteRepository;
    private final FileService fileService;
    private final UsersRepository usersRepository;

    public AssetServiceImpl(ModelMapper modelMapper, AssetRepository assetRepository, NoteRepository noteRepository, FileService fileService, UsersRepository usersRepository) {
        this.modelMapper = modelMapper;
        this.assetRepository = assetRepository;
        this.noteRepository = noteRepository;
        this.fileService = fileService;
        this.usersRepository = usersRepository;
    }

    @Override
    public InputStream getAssetFile(String assetId, UUID noteId, Long userId) {
        Asset asset = assetRepository.findByAssetId(assetId)
                .orElseThrow(() -> new ResourcesNotFoundException("Asset"));

        if (!asset.getAssetId().equals(assetId))
            throw new ResourcesNotFoundException("Asset");

        InputStream assetResource;
        String fileName = "/images/" + assetId + "." + asset.getType();

        try {
            assetResource = fileService.getNoteFile(fileName, userId, noteId.toString());

        } catch (Exception e) {
            throw new ResourcesNotFoundException("Asset" + e.getMessage());
        }

        return assetResource;
    }

    @Override
    public AssetDto createAsset(AssetDto createRequest, UUID noteId) {
        Note note = noteRepository.findByNoteId(noteId)
                .orElseThrow(() -> new ResourcesNotFoundException("Note", noteId));

        Asset assetToCreate = modelMapper.map(createRequest, Asset.class);

        assetToCreate.setAssetId(UUID.randomUUID().toString());
        assetToCreate.setCreatedAt(LocalDateTime.now());
        assetToCreate.setNote(note);

        assetRepository.save(assetToCreate);

        return null;
    }

    @Override
    public List<AssetDto> uploadAssets(List<MultipartFile> images, Long userId, UUID noteId) {
        Note note = noteRepository.findByNoteId(noteId)
                .orElseThrow(() -> new ResourcesNotFoundException("Note", noteId));

        try {
            fileService.uploadImages(images, userId, noteId.toString());
        } catch (Exception e) {
            throw new FileUploadException("File upload failed: " + e.getMessage());
        }

        List<Asset> assets = images.stream().map(image -> {
            Asset asset = new Asset();
            asset.setAssetId(image.getOriginalFilename());
            String[] typeParts = image.getContentType().split("/");
            asset.setType(typeParts[1]);
            asset.setSize(image.getSize());
            asset.setCreatedAt(LocalDateTime.now());
            asset.setNote(note);
            return asset;
        }).toList();

        assetRepository.saveAll(assets);
        return assets.stream().map(asset -> modelMapper.map(asset, AssetDto.class)).collect(Collectors.toList());
    }

    @Override
    public void deleteAssets(List<String> assetsNames, UUID noteId, Long userId) {
        usersRepository.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("User", userId));
        Note note = noteRepository.findByNoteId(noteId)
                .orElseThrow(() -> new ResourcesNotFoundException("Note", noteId));

        if (!Objects.equals(note.getUser().getId(), userId))
            throw new SessionException("You do not have permission to delete these assets");

        List<Asset> assets = assetRepository.findByAssetIdIn(assetsNames);

        if (assets.isEmpty() || assetsNames.size() != assets.size())
            throw new ResourcesNotFoundException("Assets");

        List<String> assetsForDeleting = assets.stream().map(asset -> "images/" + asset.getAssetId() + "." + asset.getType()).toList();

        fileService.deleteNoteFiles(assetsForDeleting, userId, noteId.toString());

        assetRepository.deleteAll(assets);
    }
}
