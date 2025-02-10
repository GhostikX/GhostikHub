package org.hokagex.ghostikxGoal.services.Implementation.note;

import org.hokagex.ghostikxGoal.dto.note.SnapshotDto;
import org.hokagex.ghostikxGoal.dto.note.SnapshotResponse;
import org.hokagex.ghostikxGoal.exceptions.DuplicateResourceException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.models.note.Note;
import org.hokagex.ghostikxGoal.models.note.Snapshot;
import org.hokagex.ghostikxGoal.repositories.NoteRepository;
import org.hokagex.ghostikxGoal.repositories.SnapshotRepository;
import org.hokagex.ghostikxGoal.repositories.UsersRepository;
import org.hokagex.ghostikxGoal.services.FileService;
import org.hokagex.ghostikxGoal.services.noteServices.SnapshotService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class SnapshotServiceImpl implements SnapshotService {

    private final ModelMapper modelMapper;
    private final SnapshotRepository snapshotRepository;
    private final NoteRepository noteRepository;
    private final UsersRepository usersRepository;
    private final FileService fileService;

    public SnapshotServiceImpl(ModelMapper modelMapper, SnapshotRepository snapshotRepository, NoteRepository noteRepository, UsersRepository usersRepository, FileService fileService) {
        this.modelMapper = modelMapper;
        this.snapshotRepository = snapshotRepository;
        this.noteRepository = noteRepository;
        this.usersRepository = usersRepository;
        this.fileService = fileService;
    }

    @Override
    public SnapshotResponse getSnapshotBySpecificNote(String snapshotId, Long userId, UUID noteId) {
        Snapshot snapshot = snapshotRepository.findBySnapshotId(snapshotId)
                .orElseThrow(() -> new ResourcesNotFoundException("snapshot"));

        SnapshotResponse snapshotResponse;

        String fileName = "/snapshots/" + snapshot.getSnapshotId() + ".json";
        try {
            InputStream resource = fileService.getNoteFile(fileName, userId, noteId.toString());

            snapshotResponse = new SnapshotResponse(snapshot.getSize(), resource);
        } catch (Exception e) {
            throw new ResourcesNotFoundException("Failed to retrieve file: " + e.getMessage());
        }

        return snapshotResponse;
    }

    @Override
    public SnapshotDto handleCreateUpdateSnapshot(String snapshotId, UUID noteId, Long userId, MultipartFile snapshotFile) {
        usersRepository.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("user", userId));

        boolean isUpdate = false;

        if (snapshotId != null && !snapshotId.isEmpty()) {
            Optional<Snapshot> snapshot = snapshotRepository.findBySnapshotId(snapshotId);
            isUpdate = snapshot.isPresent();
        }

       if (isUpdate) {
           return updateSnapshot(snapshotId, noteId, userId, snapshotFile);
       } else {
           return createSnapshot(noteId, userId, snapshotFile);
       }
    }

    private SnapshotDto createSnapshot(UUID noteId, Long userId, MultipartFile snapshotFile) {
        Note note = noteRepository.findByNoteId(noteId)
                .orElseThrow(() -> new ResourcesNotFoundException("Note", noteId));
        if (snapshotRepository.findByNoteId(note.getId()).isPresent())
            throw new DuplicateResourceException("Snapshot already exists for the note");

        String snapshotId = UUID.randomUUID().toString();

        fileService.uploadSnapshot(snapshotId, noteId.toString(), userId, snapshotFile);

        Snapshot snapshotToCreate = new Snapshot();
        snapshotToCreate.setSnapshotId(snapshotId);
        snapshotToCreate.setSize(snapshotFile.getSize());
        snapshotToCreate.setNote(note);
        snapshotToCreate.setCreatedAt(LocalDateTime.now());

        snapshotRepository.save(snapshotToCreate);

        return modelMapper.map(snapshotToCreate, SnapshotDto.class);
    }

    private SnapshotDto updateSnapshot(String snapshotId, UUID noteId, Long userId, MultipartFile snapshotFile) {
        Note note = noteRepository.findByNoteId(noteId)
                .orElseThrow(() -> new ResourcesNotFoundException("Note", noteId));
        Snapshot snapshot = snapshotRepository.findByNoteId(note.getId())
                .orElseThrow(() -> new ResourcesNotFoundException("snapshot"));
        if (!snapshot.getSnapshotId().equals(snapshotId))
            throw new ResourcesNotFoundException("Snapshot id is incorrect");

        fileService.uploadSnapshot(snapshotId, noteId.toString(), userId, snapshotFile);

        snapshot.setSize(snapshotFile.getSize());
        snapshotRepository.save(snapshot);

        return modelMapper.map(snapshot, SnapshotDto.class);
    }
}
