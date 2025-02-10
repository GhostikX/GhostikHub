package org.hokagex.ghostikxGoal.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.hokagex.ghostikxGoal.dto.*;
import org.hokagex.ghostikxGoal.dto.user.UserDto;
import org.hokagex.ghostikxGoal.dto.user.UserRegistrationRequest;
import org.hokagex.ghostikxGoal.dto.user.UserUpdateRequest;
import org.hokagex.ghostikxGoal.services.userServices.EmailService;
import org.hokagex.ghostikxGoal.services.userServices.UsersService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UsersController {

    private final UsersService usersService;
    private final SessionValidation sessionValidation;
    private final EmailService emailService;

    public UsersController(UsersService usersService, SessionValidation sessionValidation, EmailService emailService) {
        this.usersService = usersService;
        this.sessionValidation = sessionValidation;
        this.emailService = emailService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getUsers(HttpServletRequest request) {
        return ResponseEntity.ok(usersService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserRegistrationRequest userRegistrationRequest) {
        UserDto createdUser = usersService.insertUser(userRegistrationRequest);
        emailService.sendConfirmationEmail(createdUser);

        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUser(@PathVariable("userId") Long userId) {
        UserDto user = usersService.getUserById(userId);

        return ResponseEntity.ok(user);
    }

    @PatchMapping()
    public ResponseEntity<UserDto> updateUser(
            @Valid @RequestBody UserUpdateRequest userUpdateRequest,
            HttpServletRequest request) {

        Long userId = sessionValidation.validateSession(request).id();

        UserDto userDto = usersService.updateUser(userId, userUpdateRequest);
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        usersService.deleteUser(userId);
        return ResponseEntity.ok("User successfully deleted");
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token,  @RequestParam("name") String username) {
        boolean isVerified = emailService.verifyEmailToken(username, UUID.fromString(token));
        if (isVerified) return ResponseEntity.ok("Email verified");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/resend-verification-email")
    public ResponseEntity<String> resendVerificationEmail(@RequestParam("email") String email) {
        emailService.resendConfirmationEmail(email);
        return ResponseEntity.ok("Email resent");
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarDto>> getCalendar(HttpServletRequest request) {
        Long userId = sessionValidation.validateSession(request).id();
        List<CalendarDto> calendars = usersService.getAllCalendar(userId);
        return ResponseEntity.ok(calendars);
    }
}
