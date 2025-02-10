package org.hokagex.ghostikxGoal.services.Implementation.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


import org.hokagex.ghostikxGoal.dto.auth.LoginForm;
import org.hokagex.ghostikxGoal.dto.auth.SessionsDataResponse;
import org.hokagex.ghostikxGoal.exceptions.InvalidSessionException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.models.user.CustomUserDetails;
import org.hokagex.ghostikxGoal.services.userServices.SessionService;
import org.springframework.data.redis.core.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SessionServiceImpl implements SessionService {

    private final int MAX_SESSIONS = 3;
    private final AuthenticationManager authenticationManager;
    private final RedisTemplate<String, Object> redisTemplate;

    public SessionServiceImpl(AuthenticationManager authenticationManager, RedisTemplate<String, Object> redisTemplate) {
        this.authenticationManager = authenticationManager;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void attemptAuthentication(LoginForm loginForm, HttpSession session, HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginForm.usernameOrEmail(),
                loginForm.password()
        ));

        if (authentication.isAuthenticated()) {
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            session.setAttribute("user_device", request.getHeader("User-Agent"));
            session.setAttribute("user_location", loginForm.location());
            session.setAttribute("user_address", loginForm.ip_address());
            session.setAttribute("user_id", userDetails.getId());
            session.setAttribute("username", userDetails.getUsername());
            session.setMaxInactiveInterval(8000);

            saveSessionToRedis(session.getId(), userDetails.getUsername());
            handleUserSessions(userDetails.getUsername(), session.getId());
        } else {
            throw new BadCredentialsException("Bad credentials");
        }
    }

    @Override
    public SessionsDataResponse getAllUserSessions(Object username, String currentSessionId) {
        String userSessionKey = "user:sessions:" + username;
        Set<Object> sessionIdsSet = redisTemplate.opsForSet().members(userSessionKey);
        if (sessionIdsSet == null || sessionIdsSet.isEmpty()) {
            throw new ResourcesNotFoundException("No sessions found for the user");
        }

        Set<Object> validatedSessionIds = validateAndRemoveStaleSessions(sessionIdsSet, currentSessionId, userSessionKey);

        List<Map<String, Object>> currentSession = new ArrayList<>();
        List<Map<String, Object>> activeSession = new ArrayList<>();
        List<String> keysOfInterest = List.of("lastAccessedTime", "sessionAttr:user_location", "sessionAttr:user_device", "sessionAttr:user_address");

        for (Object sessionId : validatedSessionIds) {
            String sessionKey = "spring:session:sessions:" + sessionId;
            Map<Object, Object> sessionData = redisTemplate.opsForHash().entries(sessionKey);
            Map<String, Object> filteredData = new HashMap<>();

            for (String key : keysOfInterest) {
                if (sessionData.containsKey(key)) {
                    if (key.startsWith("session"))
                        filteredData.put(key.substring(17), sessionData.get(key));
                    else
                        filteredData.put(key, sessionData.get(key));
                }
            }

            filteredData.put("id", sessionId);
            if (currentSessionId.equals(sessionId)) {
                currentSession.add(filteredData);
            } else {
                activeSession.add(filteredData);
            }
        }

        return new SessionsDataResponse(currentSession, activeSession);
    }


    @Override
    public void logout(HttpSession session) {
        if (session == null)
            throw new InvalidSessionException("Invalid session");
        String username = (String) session.getAttribute("username");
        if (username.isEmpty())
            throw new ResourcesNotFoundException("Username not found");
        redisTemplate.opsForSet().remove("username:" + username, session.getId());
        session.invalidate();
    }

    @Override
    public void saveSessionToRedis(String sessionId, String username) {
        redisTemplate.opsForSet().add("user:sessions:" + username, sessionId);
    }

    @Override
    public void handleUserSessions(String username, String sessionId) {
        String sessionKey = "user:sessions:" + username;
        System.out.println(username);
        try {
            Set<Object> sessions = redisTemplate.opsForSet().members(sessionKey);

            Set<Object> validatedSessions = validateAndRemoveStaleSessions(sessions, sessionId, sessionKey);

            if (validatedSessions.size() > MAX_SESSIONS) {
                Object removedSessionsId = redisTemplate.opsForSet().pop(sessionKey);
                redisTemplate.delete("spring:session:sessions:" + removedSessionsId);
                System.out.println("SUCCESSFULLY DELETED SESSIONS: " + removedSessionsId);
            }

        } catch (Exception e) {
            System.err.println("Error managing sessions for user: " + username);
            e.printStackTrace();
        }
    }

    private Set<Object> validateAndRemoveStaleSessions(Set<Object> sessions, String sessionId, String userSessionKey) {

        if (sessions != null && !sessions.isEmpty()) {
            for (Object session : sessions) {
                if (!session.equals(sessionId)) {
                    String key = "spring:session:sessions:" + session;
                    boolean sessionData = redisTemplate.hasKey(key);
                    if (!sessionData) {
                        redisTemplate.opsForSet().remove(userSessionKey, session);
                        System.out.println("Sessions should be deleted by expiration");
                    }
                }
            }
        }
        return redisTemplate.opsForSet().members(userSessionKey);
    }

    @Override
    public void deactivateSession(String sessionId, String username) {
        String sessionKey = "spring:session:sessions:" + sessionId;
        System.out.println(sessionKey);
        if (redisTemplate.hasKey(sessionKey)) {
            System.out.println("DELETED!");
            redisTemplate.delete(sessionKey);
            redisTemplate.opsForSet().remove("user:sessions:" + username, sessionId);
        }
    }
}
