package org.hokagex.ghostikxGoal.dto;

import jakarta.validation.constraints.Size;

public class TaskDto {

    private Long id;
    @Size(min = 2, max = 60, message = "Title should be between 2 and 60 characters")
    private String title;
    private Boolean isCompleted;

    public TaskDto() {
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

    public Boolean getCompleted() {
        return isCompleted;
    }

    public void setCompleted(Boolean completed) {
        isCompleted = completed;
    }
}
