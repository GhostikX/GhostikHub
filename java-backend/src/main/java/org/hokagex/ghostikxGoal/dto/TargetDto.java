package org.hokagex.ghostikxGoal.dto;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class TargetDto {
    private Long id;
    @Size(min = 2, max = 60, message = "Title should be between 2 and 60 characters")
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;
    @Min(value = 0, message = "Progress cannot be less than 0")
    @Max(value = 100, message = "Progress cannot be more than 100")
    private Integer progress;
    private Integer tasksCount;

    public TargetDto(Long id, String title, LocalDateTime createdAt, LocalDateTime deadline, Integer taskCount, Integer progress) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.deadline = deadline;
        this.tasksCount = taskCount;
        this.progress = progress;
    }

    public TargetDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public Integer getTasksCount() {
        return tasksCount;
    }

    public void setTasksCount(Integer tasksCount) {
        this.tasksCount = tasksCount;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }
}
