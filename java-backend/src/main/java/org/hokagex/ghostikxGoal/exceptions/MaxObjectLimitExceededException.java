package org.hokagex.ghostikxGoal.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MaxObjectLimitExceededException extends RuntimeException {
    public MaxObjectLimitExceededException(String message) {
        super(message);
    }
}
