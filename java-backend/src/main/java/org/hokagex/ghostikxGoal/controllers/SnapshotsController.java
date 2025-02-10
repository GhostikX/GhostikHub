package org.hokagex.ghostikxGoal.controllers;


import jakarta.servlet.http.HttpServletRequest;
import org.hokagex.ghostikxGoal.dto.note.SnapshotDto;
import org.hokagex.ghostikxGoal.dto.note.SnapshotResponse;
import org.hokagex.ghostikxGoal.services.noteServices.SnapshotService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/snapshots")
public class SnapshotsController {

    private final SnapshotService snapshotService;
    private final SessionValidation sessionValidation;

    public SnapshotsController(SnapshotService snapshotService, SessionValidation sessionValidation) {
        this.snapshotService = snapshotService;
        this.sessionValidation = sessionValidation;
    }

    @GetMapping("/{snapshotId}")
    public ResponseEntity<InputStreamResource> getSnapshotFile(@PathVariable String snapshotId, @RequestParam("noteId") UUID noteId, HttpServletRequest request)
    {
        Long userId = sessionValidation.validateSession(request).id();

        SnapshotResponse snapshotResponse = snapshotService.getSnapshotBySpecificNote(snapshotId, userId, noteId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + "test" + ".json\"")
                .body(new InputStreamResource(snapshotResponse.snapshotContent()));
    }

    @PostMapping("/{noteId}")
    public ResponseEntity<SnapshotDto> handleSnapshotUpload(@PathVariable UUID noteId,
                                                            @RequestParam("snapshotId") String snapshotId,
                                                            @RequestParam("snapshotFile") MultipartFile snapshotFile,
                                                            HttpServletRequest request)
    {
        Long userId = sessionValidation.validateSession(request).id();
        SnapshotDto snapshotDTO = snapshotService.handleCreateUpdateSnapshot(snapshotId, noteId, userId, snapshotFile);
        return new ResponseEntity<>(snapshotDTO, HttpStatus.CREATED);
    }

}
