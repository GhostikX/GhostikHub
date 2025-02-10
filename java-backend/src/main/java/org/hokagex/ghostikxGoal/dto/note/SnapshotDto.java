package org.hokagex.ghostikxGoal.dto.note;

import java.util.UUID;

public class SnapshotDto {

    private UUID snapshotId;
    private String snapshotData;
    private Long size;

    public SnapshotDto() {}

    public SnapshotDto(UUID snapshotId, String snapshotData, Long size) {
        this.snapshotId = snapshotId;
        this.snapshotData = snapshotData;
        this.size = size;
    }

    public UUID getSnapshotId() {
        return snapshotId;
    }

    public void setSnapshotId(UUID snapshotId) {
        this.snapshotId = snapshotId;
    }

    public String getSnapshotData() {
        return snapshotData;
    }

    public void setSnapshotData(String snapshotData) {
        this.snapshotData = snapshotData;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

}
