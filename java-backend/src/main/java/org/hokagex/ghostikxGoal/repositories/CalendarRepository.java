package org.hokagex.ghostikxGoal.repositories;

import org.hokagex.ghostikxGoal.models.Calendar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDateTime;
import java.util.List;

public interface CalendarRepository extends JpaRepository<Calendar, Long> {
    @Query("SELECT c FROM Calendar c WHERE c.user.id = :userId AND EXTRACT(MONTH FROM c.reminderAt) = :month AND EXTRACT(YEAR FROM c.reminderAt) = :year ORDER BY c.reminderAt")
    Page<Calendar> findAllOrderedByMonthAndUser(@Param("month") Integer month, @Param("year") Integer year, Pageable pageable, Long userId);

    @Query("SELECT c FROM Calendar c WHERE c.user.id = :userId AND EXTRACT(MONTH FROM c.reminderAt) = :month AND EXTRACT(YEAR FROM c.reminderAt) = :year ORDER BY c.reminderAt")
    List<Calendar> findAllOrderedByMonthAndUser(@Param("month") Integer month, @Param("year") Integer year, Long userId);

    Page<Calendar> findAllByTitleStartingWithAndUserId(@Param("title") String title, Long userId, Pageable pageable);

    @Query("SELECT c FROM Calendar c WHERE c.user.id = :userId AND c.reminderAt BETWEEN :startOfDay AND :endOfDay Order BY c.reminderAt DESC LIMIT :limit")
    List<Calendar> findCalendarsByUserAndDateRangeWithLimit(
            @Param("userId") Long userId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay,
            @Param("limit") Integer limit
    );
}
