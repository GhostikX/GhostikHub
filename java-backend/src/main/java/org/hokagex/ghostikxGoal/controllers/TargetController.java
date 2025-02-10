package org.hokagex.ghostikxGoal.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.hokagex.ghostikxGoal.dto.TargetDto;
import org.hokagex.ghostikxGoal.dto.TaskDto;
import org.hokagex.ghostikxGoal.services.targetServices.TargetService;
import org.hokagex.ghostikxGoal.services.targetServices.TaskService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/targets")
@RestController
public class TargetController {

    private final TargetService targetService;
    private final SessionValidation sessionValidation;
    private final TaskService taskService;

    public TargetController(TargetService targetService, SessionValidation sessionValidation, TaskService taskService) {
        this.targetService = targetService;
        this.sessionValidation = sessionValidation;
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<Page<TargetDto>> getAllTargets(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size,
            HttpServletRequest request)
    {

        Long userId = sessionValidation.validateSession(request).id();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        return ResponseEntity.ok(targetService.getAllTargets(userId, pageable));
    }

    @GetMapping("/{targetId}")
    public ResponseEntity<TargetDto> getTarget(@PathVariable Long targetId, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        return ResponseEntity.ok(targetService.getTargetById(userId, targetId));
    }

    @PostMapping
    public ResponseEntity<TargetDto> saveTarget(@Valid @RequestBody TargetDto createRequest, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        return new ResponseEntity<>(targetService.createTarget(createRequest, userId), HttpStatus.CREATED);
    }

    @PatchMapping("/{targetId}")
    public ResponseEntity<TargetDto> updateTarget(@PathVariable Long targetId, @Valid @RequestBody TargetDto updateRequest, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        return ResponseEntity.ok(targetService.updateTarget(updateRequest, targetId, userId));
    }

    @DeleteMapping("/{targetId}")
    public ResponseEntity<String> deleteTarget(@PathVariable Long targetId, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        targetService.deleteTarget(targetId, userId);
        return ResponseEntity.ok("Successfully deleted target");
    }

    @GetMapping("/{targetId}/tasks")
    public ResponseEntity<List<TaskDto>> getTasksByTarget(@PathVariable Long targetId, HttpServletRequest request) {
        sessionValidation.validateSession(request);
        return ResponseEntity.ok(taskService.findAllTasksByTarget(targetId));
    }
}
