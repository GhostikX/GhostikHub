package org.hokagex.ghostikxGoal.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserRegistrationRequest {

    @NotNull(message = "Username cannot be null")
    @Size(min = 2, message = "Username should be greater than 2 characters")
    @Size(max = 60, message = "Username shouldn't exceed 60 characters")
    private String username;

    @NotNull(message = "Email cannot be null")
    @Email(message = "Email should be in correct form")
    private String email;

    @NotNull(message = "Password shouldn't be empty")
    @Size(min = 8, message = "Password should be grater than 8 characters")
    private String password;

    private String ip_address;
    private String location;

    public UserRegistrationRequest() {}

    public UserRegistrationRequest(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIp_address() {
        return ip_address;
    }

    public void setIp_address(String ip_address) {
        this.ip_address = ip_address;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
