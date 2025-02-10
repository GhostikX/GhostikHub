package org.hokagex.ghostikxGoal.dto.user;

import jakarta.validation.constraints.Email;

public class UserUpdateRequest {
    @Email(message = "Email should be in correct form")
    private String email;

    private String newPassword;

    private String currentPassword;

    public UserUpdateRequest() {}

    public UserUpdateRequest(String email, String newPassword, String currentPassword) {
        this.email = email;
        this.newPassword = newPassword;
        this.currentPassword = currentPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
}
