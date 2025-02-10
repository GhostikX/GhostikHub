package org.hokagex.ghostikxGoal.services.userServices;

import org.hokagex.ghostikxGoal.dto.*;
import org.hokagex.ghostikxGoal.dto.user.UserDto;
import org.hokagex.ghostikxGoal.dto.user.UserRegistrationRequest;
import org.hokagex.ghostikxGoal.dto.user.UserUpdateRequest;

import java.util.List;

public interface UsersService {

    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto insertUser(UserRegistrationRequest userRegistrationRequest);
    UserDto updateUser(Long id, UserUpdateRequest userUpdateRequest);
    void deleteUser(Long userId);
    List<CalendarDto> getAllCalendar(Long userId);
}
