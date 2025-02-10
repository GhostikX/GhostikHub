package org.hokagex.ghostikxGoal.repositories;

import org.hokagex.ghostikxGoal.dto.TaskDto;
import org.hokagex.ghostikxGoal.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByTargetId(Long targetId);
}
