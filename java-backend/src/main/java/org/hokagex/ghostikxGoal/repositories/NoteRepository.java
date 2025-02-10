package org.hokagex.ghostikxGoal.repositories;

import jakarta.persistence.Tuple;
import org.hokagex.ghostikxGoal.models.note.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Optional<Note> findByNoteId(UUID noteId);
    Page<Note> findAllByUserId(Long userId, Pageable pageable);
    Page<Note> findAllByTitleStartingWithAndUserId(String title, Long userId, Pageable pageable);
    List<Note> findTop3ByUserIdOrderByLastActivityDesc(Long userId);
    @Query(value = """
            SELECT 
                s.snapshot_id,
                ARRAY_AGG(a.asset_id ORDER BY a.asset_id) AS assets 
            from notes n 
                left join snapshots s ON n.id = s.note_id 
                left join assets a ON n.id = a.note_id 
            WHERE n.user_id = :userId AND n.id = :noteId 
            GROUP BY n.id, s.snapshot_id
            """, nativeQuery = true)
    Tuple findNoteSnapshotDataByNoteId(@Param("userId") Long userId, @Param("noteId") Long noteId);
    Page<Note> findAllByTagAndUserId(String tag, Long userId, Pageable pageable);
}
