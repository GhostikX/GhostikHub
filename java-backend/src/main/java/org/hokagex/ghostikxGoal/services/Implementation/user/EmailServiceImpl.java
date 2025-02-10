package org.hokagex.ghostikxGoal.services.Implementation.user;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.hokagex.ghostikxGoal.dto.user.UserDto;
import org.hokagex.ghostikxGoal.exceptions.InvalidTokenException;
import org.hokagex.ghostikxGoal.exceptions.ResourcesNotFoundException;
import org.hokagex.ghostikxGoal.models.user.EmailToken;
import org.hokagex.ghostikxGoal.models.user.UserEntity;
import org.hokagex.ghostikxGoal.repositories.EmailRepository;
import org.hokagex.ghostikxGoal.repositories.UsersRepository;
import org.hokagex.ghostikxGoal.services.userServices.EmailService;
import org.hokagex.ghostikxGoal.utils.TemplateLoader;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmailServiceImpl implements EmailService {

    private final EmailRepository emailRepository;
    private final JavaMailSender mailSender;
    private final UsersRepository usersRepository;
    private final ModelMapper modelMapper;

    @Value("${email.token.expired-time}")
    private long emailExpiredTime;
    @Value("${spring.mail.username}")
    private String emailFrom;
    @Value("${email.confirmation.url}")
    private String confirmationUrl;

    public EmailServiceImpl(EmailRepository emailRepository, JavaMailSender mailSender, UsersRepository usersRepository, ModelMapper modelMapper) {
        this.emailRepository = emailRepository;
        this.mailSender = mailSender;
        this.usersRepository = usersRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public UUID createToken(Long userId) {
        UserEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourcesNotFoundException("User not found"));

        EmailToken emailToken = new EmailToken();
        UUID token = UUID.randomUUID();

        emailToken.setToken(token);
        emailToken.setCreatedAt(LocalDateTime.now());
        emailToken.setExpiresAt(LocalDateTime.now().plusMinutes(emailExpiredTime));
        emailToken.setUser(user);

        emailRepository.save(emailToken);

        return token;
    }


    @Override
    public void sendConfirmationEmail(UserDto user) {
        String token = createToken(user.getId()).toString();
        try {
            String emailBody = TemplateLoader.loadTemplate("confirmationForm.html");

            emailBody = emailBody.replace("[Recipient's Name]", user.getUsername());
            emailBody = emailBody.replace("[Insert Link Here]", confirmationUrl + "?token=" + token + "&name=" +  user.getUsername());

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, "UTF-8");
            message.setFrom("GhostikHub <support@ghostikHub.com>");
            message.setTo(user.getEmail());
            message.setSubject("Email Confirmation");
            message.setText(emailBody, true);

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new InvalidTokenException("Invalid token");
        }
    }

    @Override
    @Transactional
    public Boolean verifyEmailToken(String username, UUID emailToken) {
        EmailToken token = emailRepository.findByToken(emailToken)
                .orElseThrow(() -> new InvalidTokenException("Invalid token"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new InvalidTokenException("Invalid token");

        if (!token.getUser().getUsername().equals(username))
            throw new InvalidTokenException("Invalid token");

        UserEntity user = token.getUser();
        user.setEmailVerified(true);
        usersRepository.save(user);

        emailRepository.deleteAllByUserId(user.getId());

        return true;
    }

    @Override
    public void resendConfirmationEmail(String email) {
        UserEntity user = usersRepository.findByEmailOrUsername(email, email)
                .orElseThrow(() -> new ResourcesNotFoundException("User not found"));

        if (user.getEmailVerified())
            throw new InvalidTokenException("The email is verified");

        Optional<EmailToken> token = emailRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId());

        System.out.println("CREATED_AT: " + token.get().getCreatedAt());
        System.out.println("CURRENT_TIME: " + LocalDateTime.now());
        if (token.isPresent())
            if (token.get().getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(5)))
                throw new InvalidTokenException("Email resending is unavailable. Please wait at least 5 minutes before trying again");

        sendConfirmationEmail(modelMapper.map(user, UserDto.class));
    }
}
