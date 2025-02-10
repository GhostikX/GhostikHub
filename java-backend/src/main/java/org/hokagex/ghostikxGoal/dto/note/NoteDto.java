package org.hokagex.ghostikxGoal.dto.note;

import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class NoteDto {

    private UUID noteId;

    @Size(min = 2, max = 60, message = "Title should be between 2 and 60 characters")
    private String title;

    @Size(max = 60, message = "Tag cannot exceed 60 characters")
    private String tag;

    private LocalDateTime createdAt;

    public NoteDto() {}

    public NoteDto(UUID noteId, String title, String tag, LocalDateTime createdAt) {
        this.noteId = noteId;
        this.title = title;
        this.tag = tag;
        this.createdAt = createdAt;
    }

    public UUID getNoteId() {
        return noteId;
    }

    public void setNoteId(UUID noteId) {
        this.noteId = noteId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
