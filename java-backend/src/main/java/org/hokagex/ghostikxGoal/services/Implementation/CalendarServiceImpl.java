package org.hokagex.ghostikxGoal.services.Implementation;

import org.hokagex.ghostikxGoal.dto.CalendarDto;
import org.hokagex.ghostikxGoal.dto.CalendarUpdateRequest;
import org.hokagex.ghostikxGoal.exceptions.InvalidSessionException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.models.Calendar;
import org.hokagex.ghostikxGoal.models.user.UserEntity;
import org.hokagex.ghostikxGoal.repositories.CalendarRepository;
import org.hokagex.ghostikxGoal.repositories.UsersRepository;
import org.hokagex.ghostikxGoal.services.CalendarService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CalendarServiceImpl implements CalendarService {

    private final CalendarRepository calendarRepository;
    private final UsersRepository usersRepository;
    private final ModelMapper modelMapper;

    public CalendarServiceImpl(CalendarRepository calendarRepository, UsersRepository usersRepository, ModelMapper modelMapper) {
        this.calendarRepository = calendarRepository;
        this.usersRepository = usersRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<CalendarDto> getAllCalendars() {
        List<Calendar> calendarList = calendarRepository.findAll();
        return calendarList.stream().map(calendar -> modelMapper.map(calendar, CalendarDto.class)).collect(Collectors.toList());

    }

    @Override
    public Page<CalendarDto> getAllUserCalendarByMonth(Integer month, Integer year, Pageable pageable, Long userId) {
        Page<Calendar> calendarPage = calendarRepository.findAllOrderedByMonthAndUser(month, year, pageable, userId);
        List<CalendarDto> calendarDto = calendarPage.stream().
                map((calendar -> modelMapper.map(calendar, CalendarDto.class))).collect(Collectors.toList());
        return new PageImpl<>(calendarDto, pageable, calendarPage.getTotalElements());
    }

    @Override
    public List<CalendarDto> getAllUserCalendarByMonth(Integer month, Integer year, Long userId) {
        List<Calendar> calendarList = calendarRepository.findAllOrderedByMonthAndUser(month, year, userId);
        return calendarList.stream().map((calendar -> modelMapper.map(calendar, CalendarDto.class))).collect(Collectors.toList());
    }

    @Override
    public List<CalendarDto> getAllUserCalendarWithUniqueDays(Integer month, Integer year, Long userId) {
        List<Calendar> calendarList = calendarRepository.findAllOrderedByMonthAndUser(month, year, userId);
        Map<LocalDate, Calendar> uniqueCalendars = new HashMap<>();

        for (Calendar calendar : calendarList) {
            LocalDate date = calendar.getReminderAt().toLocalDate();
            if (!uniqueCalendars.containsKey(date)) {
                uniqueCalendars.put(date, calendar);
            }
        }

        return uniqueCalendars.values().stream().map((calendar -> modelMapper.map(calendar, CalendarDto.class))).collect(Collectors.toList());
    }

    @Override
    public Page<CalendarDto> getAllCalendarsStartingWith(String title, Long userId, Pageable pageable) {
        Page<Calendar> calendarPage = calendarRepository.findAllByTitleStartingWithAndUserId(title, userId, pageable);

        List<CalendarDto> calendarDto = calendarPage.stream()
                .map(calendar -> modelMapper.map(calendar, CalendarDto.class)).collect(Collectors.toList());

        return new PageImpl<>(calendarDto, pageable, calendarPage.getTotalElements());
    }

    @Override
    public List<CalendarDto> getAllCalendarsByDay(LocalDateTime day, Integer limit, Long userId) {
        LocalDateTime startOfDay = day.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = day.toLocalDate().atTime(LocalTime.MAX);
        List<Calendar> calendarPage = calendarRepository.findCalendarsByUserAndDateRangeWithLimit(userId, startOfDay, endOfDay, limit);

        return calendarPage.stream()
                .map(calendar -> modelMapper.map(calendar, CalendarDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public CalendarDto getCalendarById(Long calendarId, Long userId) {
        Calendar calendar = calendarRepository.findById(calendarId)
                .orElseThrow(() -> new ResourcesNotFoundException("Calendar", calendarId));
        if (!calendar.getUser().getId().equals(userId))
            throw new InvalidSessionException("Session expired or not valid");


        return modelMapper.map(calendar, CalendarDto.class);
    }

    @Override
    public CalendarDto createCalendar(Long userId, CalendarDto registerRequest) {
        UserEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("User", userId));

        Calendar calendarToCreate = modelMapper.map(registerRequest, Calendar.class);

        calendarToCreate.setUser(user);
        calendarToCreate.setSetAt(LocalDateTime.now());

        calendarRepository.save(calendarToCreate);

        return modelMapper.map(calendarToCreate, CalendarDto.class);
    }

    @Override
    public CalendarDto updateCalendar(Long calendarId, CalendarUpdateRequest updateRequest) {
        Calendar calendarToBeUpdate = calendarRepository.findById(calendarId)
                .orElseThrow(() -> new ResourcesNotFoundException("Calendar", calendarId));

        if (updateRequest.getTitle() != null)
            calendarToBeUpdate.setTitle(updateRequest.getTitle());
        if (updateRequest.getReminderAt() != null)
            calendarToBeUpdate.setReminderAt(updateRequest.getReminderAt());

        calendarRepository.save(calendarToBeUpdate);

        return modelMapper.map(calendarToBeUpdate, CalendarDto.class);
    }

    @Override
    public void deleteCalendar(Long calendarId, Long userId) {
        Calendar calendarToDelete = calendarRepository.findById(calendarId)
                .orElseThrow(() -> new ResourcesNotFoundException("Calendar", calendarId));

        if (!calendarToDelete.getUser().getId().equals(userId)) {
            throw new InvalidSessionException("Session expired or not valid");
        }

        calendarRepository.delete(calendarToDelete);
    }
}
