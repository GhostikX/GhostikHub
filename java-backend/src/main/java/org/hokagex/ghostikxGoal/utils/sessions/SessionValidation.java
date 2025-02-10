package org.hokagex.ghostikxGoal.utils.sessions;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.hokagex.ghostikxGoal.dto.auth.SessionData;
import org.hokagex.ghostikxGoal.exceptions.InvalidSessionException;
import org.springframework.stereotype.Component;

import java.util.Optional;


@Component
public class SessionValidation {

    public SessionData validateSession(HttpServletRequest request) throws InvalidSessionException {
        Optional<HttpSession> sessionOpt = Optional.ofNullable(request.getSession(false));
        HttpSession session = sessionOpt.orElseThrow(() -> new InvalidSessionException("Session is not valid or expired"));
        Optional<Long> userIdOpt = Optional.ofNullable((Long) session.getAttribute("user_id"));
        Long userId = userIdOpt.orElseThrow(() -> new InvalidSessionException("User not logged in"));

        return new SessionData(userId, (String) session.getAttribute("username"));
    }
}

