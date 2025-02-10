package org.hokagex.ghostikxGoal.services.noteServices;

import org.hokagex.ghostikxGoal.dto.note.AssetDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

public interface AssetService {

    InputStream getAssetFile(String assetId, UUID noteId, Long userId);
    AssetDto createAsset(AssetDto createRequest, UUID noteId);
    List<AssetDto> uploadAssets(List<MultipartFile> images, Long userId, UUID noteId);
    void deleteAssets(List<String> assetsNames, UUID noteId, Long userId);
}
