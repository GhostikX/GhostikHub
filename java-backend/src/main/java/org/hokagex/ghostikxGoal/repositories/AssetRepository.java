package org.hokagex.ghostikxGoal.repositories;

import org.hokagex.ghostikxGoal.models.note.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByAssetId(String assetId);
    List<Asset> findByAssetIdIn(List<String> assetNames);
}
