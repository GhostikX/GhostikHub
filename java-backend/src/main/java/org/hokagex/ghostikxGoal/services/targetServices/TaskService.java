package org.hokagex.ghostikxGoal.services.targetServices;

import org.hokagex.ghostikxGoal.dto.TaskDto;

import java.util.List;

public interface TaskService {
    List<TaskDto> findAllTasksByTarget(Long targetId);
    TaskDto findTaskById(Long taskId);
    TaskDto addTask(TaskDto createRequest, Long targetId);
    TaskDto updateTask(TaskDto updateRequest, Long taskId);
    void deleteTask(Long taskId);
    Integer countTargetProgress(Long targetId);
    Boolean isTasksSizeExceeded(Long targetId);
}
