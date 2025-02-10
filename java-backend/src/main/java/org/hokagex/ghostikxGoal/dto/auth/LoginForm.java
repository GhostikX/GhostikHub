package org.hokagex.ghostikxGoal.dto.auth;

public record LoginForm(String usernameOrEmail, String password, String ip_address, String location) {
}
