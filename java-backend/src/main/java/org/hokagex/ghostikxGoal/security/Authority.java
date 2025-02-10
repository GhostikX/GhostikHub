package org.hokagex.ghostikxGoal.security;

public enum Authority {
    ROLE_USER,
    ROLE_ADMIN;

    public String getAuthority() {
        return name();
    }
}
