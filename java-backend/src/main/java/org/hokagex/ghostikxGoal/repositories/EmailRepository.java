package org.hokagex.ghostikxGoal.repositories;

import org.hokagex.ghostikxGoal.models.user.EmailToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmailRepository extends JpaRepository<EmailToken, Long> {
    Optional<EmailToken> findByToken(UUID token);
    Optional<EmailToken> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteAllByUserId(long userId);
}
