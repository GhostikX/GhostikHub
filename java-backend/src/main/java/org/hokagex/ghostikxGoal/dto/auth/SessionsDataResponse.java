package org.hokagex.ghostikxGoal.dto.auth;

import java.util.List;
import java.util.Map;

public record SessionsDataResponse(List<Map<String, Object>> currentSession, List<Map<String, Object>> activeSession) {
}
