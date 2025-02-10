package org.hokagex.ghostikxGoal.dto.note;

import java.io.InputStream;

public record SnapshotResponse(Long snapshotSize, InputStream snapshotContent) {
}
