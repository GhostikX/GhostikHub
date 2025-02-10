package org.hokagex.ghostikxGoal.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.hokagex.ghostikxGoal.dto.TaskDto;
import org.hokagex.ghostikxGoal.services.targetServices.TaskService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RequestMapping("/tasks")
@RestController
public class TaskController {

    private final TaskService taskService;
    private final SessionValidation sessionValidation;

    public TaskController(TaskService taskService, SessionValidation sessionValidation) {
        this.taskService = taskService;
        this.sessionValidation = sessionValidation;
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDto> getTask(@PathVariable Long taskId, HttpServletRequest request) {
        sessionValidation.validateSession(request);
        return ResponseEntity.ok(taskService.findTaskById(taskId));
    }

    @PostMapping("/{targetId}")
    public ResponseEntity<TaskDto> createTask(@PathVariable Long targetId, @Valid @RequestBody TaskDto createRequest, HttpServletRequest request) {
        sessionValidation.validateSession(request);
        return new ResponseEntity<>(taskService.addTask(createRequest, targetId), HttpStatus.CREATED);
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<TaskDto> updateTaskAndTargetProgress(@PathVariable Long taskId, @Valid @RequestBody TaskDto updateRequest, HttpServletRequest request) {
        sessionValidation.validateSession(request);
        return new ResponseEntity<>(taskService.updateTask(updateRequest, taskId), HttpStatus.OK);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable Long taskId, HttpServletRequest request) {
        sessionValidation.validateSession(request);
        taskService.deleteTask(taskId);
        return ResponseEntity.ok("Deleted successfully.");
    }

    @GetMapping("/testDate")
    public ResponseEntity<LocalDateTime> testIso() {
        return ResponseEntity.ok(LocalDateTime.now());
    }
}
