package org.hokagex.ghostikxGoal.dto;

import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CalendarUpdateRequest {
    @Size(min = 2, max = 60, message = "Title should be between 2 and 60 characters")
    private String title;

    private LocalDateTime reminderAt;

    public CalendarUpdateRequest() {}

    public CalendarUpdateRequest(String title, LocalDateTime reminderAt) {
        this.title = title;
        this.reminderAt = reminderAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getReminderAt() {
        return reminderAt;
    }

    public void setReminderAt(LocalDateTime reminderAt) {
        this.reminderAt = reminderAt;
    }
}
