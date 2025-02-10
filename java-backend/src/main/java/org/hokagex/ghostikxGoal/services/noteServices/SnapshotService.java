package org.hokagex.ghostikxGoal.services.noteServices;

import org.hokagex.ghostikxGoal.dto.note.SnapshotDto;
import org.hokagex.ghostikxGoal.dto.note.SnapshotResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface SnapshotService {
    SnapshotResponse getSnapshotBySpecificNote(String snapshotId, Long userId, UUID noteId);
    SnapshotDto handleCreateUpdateSnapshot(String snapshotId, UUID noteId, Long userId, MultipartFile snapshotFile);
}
