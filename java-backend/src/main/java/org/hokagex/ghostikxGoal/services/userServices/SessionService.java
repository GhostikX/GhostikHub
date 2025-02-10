package org.hokagex.ghostikxGoal.services.userServices;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.hokagex.ghostikxGoal.dto.auth.LoginForm;
import org.hokagex.ghostikxGoal.dto.auth.SessionsDataResponse;

public interface SessionService {

    void attemptAuthentication(LoginForm loginForm, HttpSession session, HttpServletRequest request, HttpServletResponse response);
    SessionsDataResponse getAllUserSessions(Object username, String sessionId);
    void logout(HttpSession session);
    void saveSessionToRedis(String sessionId, String username);
    void handleUserSessions(String username, String sessionId);
    void deactivateSession(String sessionId, String username);
}
