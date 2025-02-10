package org.hokagex.ghostikxGoal.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.hokagex.ghostikxGoal.dto.DashboardData;
import org.hokagex.ghostikxGoal.dto.auth.SessionData;
import org.hokagex.ghostikxGoal.services.DashboardService;
import org.hokagex.ghostikxGoal.utils.sessions.SessionValidation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final SessionValidation sessionValidation;

    public DashboardController(DashboardService dashboardService, SessionValidation sessionValidation) {
        this.dashboardService = dashboardService;
        this.sessionValidation = sessionValidation;
    }

    @GetMapping
    public ResponseEntity<DashboardData> getDashboard(
            @RequestParam LocalDateTime day,
            @RequestParam Integer limit,
            HttpServletRequest request)
    {
       SessionData session = sessionValidation.validateSession(request);

        return ResponseEntity.ok(dashboardService.getDashboard(session, day, limit));
    }
}
