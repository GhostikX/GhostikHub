package org.hokagex.ghostikxGoal.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.hokagex.ghostikxGoal.dto.auth.LoginForm;
import org.hokagex.ghostikxGoal.dto.auth.SessionsDataResponse;
import org.hokagex.ghostikxGoal.dto.auth.UserData;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.services.userServices.SessionService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final SessionService sessionService;
    private final SessionValidation sessionValidation;

    public AuthController(SessionService authService, SessionValidation sessionValidation) {
        this.sessionService = authService;
        this.sessionValidation = sessionValidation;
    }


    @PostMapping
    public ResponseEntity<String> authenticateUser(@RequestBody LoginForm loginForm, HttpSession session, HttpServletRequest request, HttpServletResponse resp) {
        sessionService.attemptAuthentication(loginForm, session, request, resp);
        return ResponseEntity.ok().body("User successfully authenticated");
    }

    @GetMapping("/userSessions")
    public ResponseEntity<SessionsDataResponse> getUserSessions(HttpSession session){
        Object username = session.getAttribute("username");
        String sessionId = session.getId();
        if (username == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        SessionsDataResponse sessionIds = sessionService.getAllUserSessions(username, sessionId);

        return ResponseEntity.ok(sessionIds);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        sessionService.logout(session);
        return ResponseEntity.ok("Logout successful");
    }

    @PostMapping("/sessionState")
    public ResponseEntity<String> checkSessionValidity(@RequestBody UserData userData, HttpServletRequest request) {

        HttpSession session = request.getSession(false);
        if (session == null) {
            System.out.println("Session is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session is not valid or expired");
        }
        else if (session.getAttribute("user_device") == null ||!session.getAttribute("user_device").toString().contains(request.getHeader("User-Agent"))) {
            System.out.println("User agent is not valid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session is not valid or expired");
        }
        else if (!session.getAttribute("user_location").toString().contains(userData.location())) {
            System.out.println("Location is incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session is not valid or expired");
        }
        else if (!session.getAttribute("user_address").toString().contains(userData.ip_address())) {
            System.out.println("Address is incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session is not valid or expired");
        }

        return ResponseEntity.ok("Session are valid");
    }

    @DeleteMapping("/deactivate")
    public ResponseEntity<String> deactivateSession(HttpServletRequest request, @RequestBody Map<String, String> sessionData) {
        String sessionId = sessionData.get("sessionId");
        String username = sessionValidation.validateSession(request).username();
        if (sessionId == null || sessionId.isEmpty())
            throw new ResourcesNotFoundException(sessionId);

        System.out.println(sessionId);

        sessionService.deactivateSession(sessionId, username);

        return ResponseEntity.ok("Session deactivated");
    }
}
