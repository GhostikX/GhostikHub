package org.hokagex.ghostikxGoal.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.hokagex.ghostikxGoal.dto.note.AssetDto;
import org.hokagex.ghostikxGoal.services.noteServices.AssetService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/assets")
public class AssetController {

    private final SessionValidation sessionValidation;
    private final AssetService assetService;

    public AssetController(SessionValidation sessionValidation, AssetService assetService) {
        this.sessionValidation = sessionValidation;
        this.assetService = assetService;
    }

    @PostMapping("/{noteId}")
    public ResponseEntity<AssetDto> uploadImageAsset(@PathVariable UUID noteId, @RequestBody AssetDto createRequest) {
        AssetDto assetDTO = assetService.createAsset(createRequest, noteId);
        return new ResponseEntity<>(assetDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{noteId}/{assetId}")
    public ResponseEntity<InputStreamResource> getAssetFile(@PathVariable UUID noteId, @PathVariable String assetId, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();

        return ResponseEntity.ok(new InputStreamResource(assetService.getAssetFile(assetId, noteId, userId)));
    }

    @PostMapping
    public ResponseEntity<List<AssetDto>> uploadAssetsFiles(@RequestParam("files") List<MultipartFile> files, @RequestParam("noteId") UUID noteId, HttpServletRequest request) throws Exception
    {
        Long userId = sessionValidation.validateSession(request).id();
        return new ResponseEntity<>(assetService.uploadAssets(files, userId, noteId), HttpStatus.CREATED);
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<String> deleteAssetsByName(@PathVariable UUID noteId, @RequestBody List<String> assetsNames, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        assetService.deleteAssets(assetsNames, noteId, userId);
        return ResponseEntity.ok("Successfully deleted assets");
    }
}
