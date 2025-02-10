package org.hokagex.ghostikxGoal.services;

import org.hokagex.ghostikxGoal.dto.CalendarDto;
import org.hokagex.ghostikxGoal.dto.CalendarUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface CalendarService {

    List<CalendarDto> getAllCalendars();
    Page<CalendarDto> getAllUserCalendarByMonth(Integer month, Integer year, Pageable pageable, Long userId);
    List<CalendarDto> getAllUserCalendarByMonth(Integer month, Integer year, Long userId);
    List<CalendarDto> getAllUserCalendarWithUniqueDays(Integer month, Integer year, Long userId);
    Page<CalendarDto> getAllCalendarsStartingWith(String title, Long userId, Pageable pageable);
    List<CalendarDto> getAllCalendarsByDay(LocalDateTime day, Integer limit, Long userId);
    CalendarDto getCalendarById(Long calendarId, Long userId);
    CalendarDto createCalendar(Long userId, CalendarDto registerRequest);
    CalendarDto updateCalendar(Long calendarId, CalendarUpdateRequest updateRequest);
    void deleteCalendar(Long calendarId, Long userId);
}
