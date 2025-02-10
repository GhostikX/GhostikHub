package org.hokagex.ghostikxGoal.exceptions;

import java.time.LocalDateTime;

public record ApiError(
        String path,
        String message,
        Integer statusCode,
        LocalDateTime time
) {
}
