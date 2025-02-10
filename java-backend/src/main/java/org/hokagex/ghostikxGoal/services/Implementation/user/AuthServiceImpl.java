package org.hokagex.ghostikxGoal.services.Implementation.user;

import org.hokagex.ghostikxGoal.models.user.CustomUserDetails;
import org.hokagex.ghostikxGoal.models.user.UserEntity;
import org.hokagex.ghostikxGoal.repositories.UsersRepository;
import org.hokagex.ghostikxGoal.security.Authority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AuthServiceImpl implements UserDetailsService {

    private final UsersRepository usersRepository;

    public AuthServiceImpl(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public CustomUserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        UserEntity user = usersRepository.findByEmailOrUsername(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Authority> userAuthorities = List.of(Authority.ROLE_USER);

        return new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getEncryptedPassword(),
                user.getEmailVerified(),
                userAuthorities
        );
    }


}
