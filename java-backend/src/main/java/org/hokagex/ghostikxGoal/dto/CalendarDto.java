package org.hokagex.ghostikxGoal.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Objects;

public class CalendarDto {
    private Long id;

    @Size(min = 2, max = 250, message = "Title should be between 2 and 250 characters")
    private String title;

    @NotNull(message = "The reminder shouldn't be empty")
    private LocalDateTime reminderAt;

    public CalendarDto() {}

    public CalendarDto(Long id, String title, LocalDateTime reminderAt) {
        this.id = id;
        this.title = title;
        this.reminderAt = reminderAt;
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

    public void setTitle (String title) {
        this.title = title;
    }

    public LocalDateTime getReminderAt() {
        return reminderAt;
    }

    public void setReminderAt(LocalDateTime reminderAt) {
        this.reminderAt = reminderAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CalendarDto that = (CalendarDto) o;
        return Objects.equals(id, that.id) && Objects.equals(title, that.title) && Objects.equals(reminderAt, that.reminderAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, reminderAt);
    }
}
