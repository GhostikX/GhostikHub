package org.hokagex.ghostikxGoal.services.userServices;

import org.hokagex.ghostikxGoal.dto.user.UserDto;

import java.util.UUID;

public interface EmailService {

    UUID createToken(Long userId);
    void sendConfirmationEmail(UserDto user);
    Boolean verifyEmailToken(String username, UUID emailToken);
    void resendConfirmationEmail(String email);
}
