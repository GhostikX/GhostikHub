package org.hokagex.ghostikxGoal.dto.note;

public class AssetDto {

    private String assetId;

    private String type;

    private Long size;

    public AssetDto() {}

    public AssetDto(String assetId, String type, Long size) {
        this.assetId = assetId;
        this.type = type;
        this.size = size;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }
}
