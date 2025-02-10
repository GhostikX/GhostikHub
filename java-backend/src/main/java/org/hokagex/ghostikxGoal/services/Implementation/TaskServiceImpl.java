package org.hokagex.ghostikxGoal.services.Implementation;

import org.hokagex.ghostikxGoal.dto.TaskDto;
import org.hokagex.ghostikxGoal.exceptions.MaxObjectLimitExceededException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.models.Target;
import org.hokagex.ghostikxGoal.models.Task;
import org.hokagex.ghostikxGoal.repositories.TargetRepository;
import org.hokagex.ghostikxGoal.repositories.TaskRepository;
import org.hokagex.ghostikxGoal.services.targetServices.TaskService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ModelMapper modelMapper;
    private final TargetRepository targetRepository;

    public TaskServiceImpl(TaskRepository taskRepository, ModelMapper modelMapper, TargetRepository targetRepository) {
        this.taskRepository = taskRepository;
        this.modelMapper = modelMapper;
        this.targetRepository = targetRepository;
    }

    @Override
    public List<TaskDto> findAllTasksByTarget(Long targetId) {
        targetRepository.findById(targetId)
                .orElseThrow(() -> new ResourcesNotFoundException("Target", targetId));

        List<Task> tasks = taskRepository.findAllByTargetId(targetId);
        return tasks.stream()
                .map(task -> modelMapper.map(task, TaskDto.class)).collect(Collectors.toList());
    }

    @Override
    public TaskDto findTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId).
                orElseThrow(() -> new ResourcesNotFoundException("Task", taskId));

        return modelMapper.map(task, TaskDto.class);
    }

    @Override
    public TaskDto addTask(TaskDto createRequest, Long targetId) {
        Target target = targetRepository.findById(targetId)
                .orElseThrow(() -> new ResourcesNotFoundException("Target", targetId));

        if (isTasksSizeExceeded(targetId))
            throw new MaxObjectLimitExceededException("The target cannot has more than 10 tasks");

        Task taskToCreate = modelMapper.map(createRequest, Task.class);

        taskToCreate.setTitle(taskToCreate.getTitle());
        taskToCreate.setCompleted(false);
        taskToCreate.setTarget(target);

        taskRepository.save(taskToCreate);

        return modelMapper.map(taskToCreate, TaskDto.class);
    }

    @Override
    public TaskDto updateTask(TaskDto updateRequest, Long taskId) {
        Task taskToUpdate = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourcesNotFoundException("Task", taskId));


        if (updateRequest.getTitle() != null)
            taskToUpdate.setTitle(updateRequest.getTitle());
        if (updateRequest.getCompleted() != null)
            taskToUpdate.setCompleted(updateRequest.getCompleted());

        taskRepository.save(taskToUpdate);

        return modelMapper.map(taskToUpdate, TaskDto.class);
    }

    @Override
    public void deleteTask(Long taskId) {
        Task taskToDelete = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourcesNotFoundException("Task", taskId));

        taskRepository.delete(taskToDelete);
    }

    @Override
    public Integer countTargetProgress(Long targetId) {
        List<TaskDto> tasks = findAllTasksByTarget(targetId);
        if (tasks.isEmpty()) return 0;
        long completedTasks = tasks.stream().filter(TaskDto::getCompleted).count();
        if (completedTasks == 0) return 0;
        double percentage = ((double) completedTasks / tasks.size()) * 100;
        return Math.toIntExact(Math.round(percentage));
    }

    @Override
    public Boolean isTasksSizeExceeded(Long targetId) {
        return findAllTasksByTarget(targetId).size() == 10;
    }
}
