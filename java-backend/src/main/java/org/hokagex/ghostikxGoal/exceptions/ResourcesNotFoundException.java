package org.hokagex.ghostikxGoal.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourcesNotFoundException extends RuntimeException {
    public ResourcesNotFoundException(String nameOfObject, Long resourceId) {
        super(nameOfObject + " not found with current id: " + resourceId);
    }
    public ResourcesNotFoundException(String nameOfObject, UUID resourceId) {
        super(nameOfObject + " not found with current id: " + resourceId);
    }
    public ResourcesNotFoundException(String nameOfObject) {
        super(nameOfObject + " file are not found");
    }
}
