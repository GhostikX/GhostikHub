package org.hokagex.ghostikxGoal.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.hokagex.ghostikxGoal.dto.CalendarDto;
import org.hokagex.ghostikxGoal.dto.CalendarUpdateRequest;
import org.hokagex.ghostikxGoal.services.CalendarService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calendar")
public class CalendarController {

    private final CalendarService calendarService;
    private final SessionValidation sessionValidation;

    public CalendarController(CalendarService calendarService, SessionValidation sessionValidation) {
        this.calendarService = calendarService;
        this.sessionValidation = sessionValidation;
    }

    @GetMapping
    public ResponseEntity<List<CalendarDto>> getCalendars() {
        List<CalendarDto> calendarList = calendarService.getAllCalendars();
        return ResponseEntity.ok(calendarList);
    }

    @GetMapping("/sorted")
    public ResponseEntity<?> getCalendarsSortedByMonthAndYear(
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "5") Integer size,
            HttpServletRequest request
    ) {
        Long userId = sessionValidation.validateSession(request).id();
        if (page == null || size == null ) {
            List<CalendarDto> calendarList = calendarService.getAllUserCalendarByMonth(month, year, userId);
            return ResponseEntity.ok(calendarList);
        } else {
            Pageable pageable = PageRequest.of(page, size);
            Page<CalendarDto> calendarList = calendarService.getAllUserCalendarByMonth(month, year, pageable, userId);
            return ResponseEntity.ok(calendarList);
        }
    }

    @GetMapping("/unique")
    public ResponseEntity<List<CalendarDto>> getCalendarsUnique(
            @RequestParam Integer year,
            @RequestParam Integer month,
            HttpServletRequest request
    ) {
        Long userId = sessionValidation.validateSession(request).id();
        return ResponseEntity.ok(calendarService.getAllUserCalendarWithUniqueDays(month, year, userId));
    }

    @GetMapping("/search/{title}")
    public ResponseEntity<Page<CalendarDto>> getCalendarsStartingWithTitle(
            @PathVariable String title,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "5") Integer size,
            HttpServletRequest request)
    {
        Long userId = sessionValidation.validateSession(request).id();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(calendarService.getAllCalendarsStartingWith(title, userId, pageable));
    }

    @GetMapping("/{calendarId}")
    public ResponseEntity<CalendarDto> getCalendarById(@PathVariable("calendarId") Long calendarId, HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        CalendarDto calendar = calendarService.getCalendarById(calendarId, userId);
        return ResponseEntity.ok(calendar);
    }

    @PostMapping("/saveCalendar")
    public ResponseEntity<CalendarDto> createCalendar(@Valid @RequestBody CalendarDto createRequest,
                                                      HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        CalendarDto createdCalendar = calendarService.createCalendar(userId, createRequest);
        return new ResponseEntity<>(createdCalendar, HttpStatus.CREATED);
    }

    @PatchMapping("/{calendarId}")
    public ResponseEntity<CalendarDto> updateCalendar(@PathVariable("calendarId") Long calendarId,
                                                      @Valid @RequestBody CalendarUpdateRequest updateRequest,
                                                      HttpServletRequest request) {
        sessionValidation.validateSession(request);
        CalendarDto updatedCalendar = calendarService.updateCalendar(calendarId, updateRequest);
        return ResponseEntity.ok(updatedCalendar);
    }

    @DeleteMapping("/{calendarId}")
    public ResponseEntity<String> deleteCalendar(@PathVariable("calendarId") Long calendarId,
                                                 HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        calendarService.deleteCalendar(calendarId, userId);
        return ResponseEntity.ok("Calendar successfully deleted.");
    }
}
