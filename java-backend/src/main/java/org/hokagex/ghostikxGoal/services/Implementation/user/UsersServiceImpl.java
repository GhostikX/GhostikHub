package org.hokagex.ghostikxGoal.services.Implementation.user;

import org.hokagex.ghostikxGoal.dto.*;
import org.hokagex.ghostikxGoal.dto.user.UserDto;
import org.hokagex.ghostikxGoal.dto.user.UserRegistrationRequest;
import org.hokagex.ghostikxGoal.dto.user.UserUpdateRequest;
import org.hokagex.ghostikxGoal.exceptions.DuplicateResourceException;
import org.hokagex.ghostikxGoal.exceptions.InvalidPasswordException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.models.Calendar;
import org.hokagex.ghostikxGoal.models.user.UserEntity;
import org.hokagex.ghostikxGoal.repositories.UsersRepository;
import org.hokagex.ghostikxGoal.services.userServices.UsersService;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsersServiceImpl implements UsersService {

    private final UsersRepository usersRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public UsersServiceImpl(UsersRepository usersRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<UserEntity> users = usersRepository.findAll();
        return users.stream().map((user) -> modelMapper.map(user, UserDto.class)).collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long userId) {
        Optional<UserEntity> user = usersRepository.findById(userId);

        if (user.isEmpty())
            throw new ResourcesNotFoundException("User", userId);

        return modelMapper.map(user.get(), UserDto.class);
    }

    @Override
    public UserDto insertUser(UserRegistrationRequest userRegistrationRequest) {

        if (usersRepository.existsByEmail(userRegistrationRequest.getEmail()))
            throw new DuplicateResourceException("Current email is already taken");
        if (usersRepository.existsByUsername(userRegistrationRequest.getUsername()))
            throw new DuplicateResourceException("Current username is already taken");

        UserEntity userToCreate = modelMapper.map(userRegistrationRequest, UserEntity.class);

        userToCreate.setCreatedAt(LocalDateTime.now());
        userToCreate.setEncryptedPassword(passwordEncoder.encode(userRegistrationRequest.getPassword()));
        userToCreate.setEmailVerified(false);

        usersRepository.save(userToCreate);

        return modelMapper.map(userToCreate, UserDto.class);
    }

    @Override
    public UserDto updateUser(Long id, UserUpdateRequest userUpdateRequest) {

        UserEntity userToUpdate = usersRepository.findById(id).
                orElseThrow(() -> new ResourcesNotFoundException("User", id));

        String requestedEmail = userUpdateRequest.getEmail();

        if (usersRepository.existsByEmail(requestedEmail) && !userToUpdate.getEmail().equals(requestedEmail))
            throw new DuplicateResourceException("Current email is already taken");

        if (requestedEmail != null && !requestedEmail.isBlank())
            userToUpdate.setEmail(requestedEmail);
        if (userUpdateRequest.getNewPassword() != null && !userUpdateRequest.getNewPassword().isBlank()){
            String newPassword = userUpdateRequest.getNewPassword();
            String currentPassword = userUpdateRequest.getCurrentPassword();
            if (newPassword.length() < 8)
                throw new InvalidPasswordException("New password must be at least 8 characters");
            if (newPassword.equals(currentPassword))
                throw new InvalidPasswordException("New passwords should not be the same");
            if (currentPassword == null || !passwordEncoder.matches(currentPassword, userToUpdate.getEncryptedPassword())) {
                throw new InvalidPasswordException("The current password is incorrect.");
            }
            userToUpdate.setEncryptedPassword(passwordEncoder.encode(userUpdateRequest.getNewPassword()));
        }

        usersRepository.save(userToUpdate);

        return modelMapper.map(userToUpdate, UserDto.class);
    }

    @Override
    public void deleteUser(Long userId) {
        UserEntity userToDelete = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("User", userId));

        usersRepository.delete(userToDelete);
    }

    @Override
    public List<CalendarDto> getAllCalendar(Long userId) {
        UserEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("User", userId));

        List<Calendar> calendarList = user.getCalendarList();

        return calendarList.stream()
                .sorted(Comparator.comparing(Calendar::getSetAt))
                .map((calendar -> modelMapper.map(calendar, CalendarDto.class)))
                .collect(Collectors.toList());
    }
}
