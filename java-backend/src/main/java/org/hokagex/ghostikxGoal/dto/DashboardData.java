package org.hokagex.ghostikxGoal.dto;

import org.hokagex.ghostikxGoal.dto.note.NoteDto;
import org.hokagex.ghostikxGoal.dto.note.SnapshotDto;

import java.util.List;

public class DashboardData {
    private List<CalendarDto> calendars;
    private List<NoteDto> notes;
    private List<TargetDto> targets;
    private String username;

    public DashboardData() {
    }

    public DashboardData(List<CalendarDto> calendars, List<NoteDto> notes, List<TargetDto> targets, String username) {
        this.calendars = calendars;
        this.notes = notes;
        this.targets = targets;
        this.username = username;
    }

    public List<CalendarDto> getCalendars() {
        return calendars;
    }

    public void setCalendars(List<CalendarDto> calendars) {
        this.calendars = calendars;
    }

    public List<NoteDto> getNotes() {
        return notes;
    }

    public void setNotes(List<NoteDto> notes) {
        this.notes = notes;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<TargetDto> getTargets() {
        return targets;
    }

    public void setTargets(List<TargetDto> targets) {
        this.targets = targets;
    }
}
