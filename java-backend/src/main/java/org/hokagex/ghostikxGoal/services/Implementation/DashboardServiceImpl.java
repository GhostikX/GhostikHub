package org.hokagex.ghostikxGoal.services.Implementation;

import org.hokagex.ghostikxGoal.dto.CalendarDto;
import org.hokagex.ghostikxGoal.dto.DashboardData;
import org.hokagex.ghostikxGoal.dto.note.NoteDto;
import org.hokagex.ghostikxGoal.dto.TargetDto;
import org.hokagex.ghostikxGoal.dto.auth.SessionData;
import org.hokagex.ghostikxGoal.services.CalendarService;
import org.hokagex.ghostikxGoal.services.DashboardService;
import org.hokagex.ghostikxGoal.services.noteServices.NoteService;
import org.hokagex.ghostikxGoal.services.targetServices.TargetService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final NoteService noteService;
    private final CalendarService calendarService;
    private final TargetService targetService;

    public DashboardServiceImpl(NoteService noteService, CalendarService calendarService, TargetService targetService) {
        this.noteService = noteService;
        this.calendarService = calendarService;
        this.targetService = targetService;
    }

    @Override
    public DashboardData getDashboard(SessionData sessionData, LocalDateTime day, Integer limit) {
        DashboardData dashboardData = new DashboardData();

        List<NoteDto> notes = noteService.getTop3RecentNotes(sessionData.id());
        List<CalendarDto> calendars = calendarService.getAllCalendarsByDay(day, limit, sessionData.id());
        List<TargetDto> targets = targetService.getAllTargetsByDeadline(sessionData.id(), limit);

        dashboardData.setNotes(notes);
        dashboardData.setCalendars(calendars);
        dashboardData.setTargets(targets);
        dashboardData.setUsername(sessionData.username());
        return dashboardData;
    }
}
