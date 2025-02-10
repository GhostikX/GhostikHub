package org.hokagex.ghostikxGoal.repositories;

import org.hokagex.ghostikxGoal.models.Target;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TargetRepository extends JpaRepository<Target, Long> {
    Page<Target> findAllByUserId(Long userId, Pageable pageable);

    @Query("SELECT t FROM Target t WHERE t.user.id = :userId ORDER BY t.deadline DESC LIMIT :limit ")
    List<Target> findAllByUserIdAndSortedByDeadline(@Param("userId") Long userId, @Param("limit") int limit);
}
