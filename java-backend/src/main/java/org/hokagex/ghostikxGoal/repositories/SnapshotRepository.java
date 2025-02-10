package org.hokagex.ghostikxGoal.repositories;

import org.hokagex.ghostikxGoal.models.note.Snapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface SnapshotRepository extends JpaRepository<Snapshot, Long> {
    Optional<Snapshot> findBySnapshotId(String snapshotId);
    Optional<Snapshot> findByNoteId(Long noteId);
//    List<Snapshot> findAllByUserId(Long userId);
//    Page<Snapshot> findAllByUserId(Long userId, Pageable pageable);
//    Page<Snapshot> findAllByTitleStartingWithAndUserId(@Param("title") String title, Long userId, Pageable pageable);
//    List<Snapshot> findTop3ByUserIdOrderByLastActivityDesc(Long userId);
}
