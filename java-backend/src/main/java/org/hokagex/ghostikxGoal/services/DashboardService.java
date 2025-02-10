package org.hokagex.ghostikxGoal.services;

import org.hokagex.ghostikxGoal.dto.DashboardData;
import org.hokagex.ghostikxGoal.dto.auth.SessionData;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface DashboardService {
    DashboardData getDashboard(SessionData sessionData, LocalDateTime day, Integer limit);
}
