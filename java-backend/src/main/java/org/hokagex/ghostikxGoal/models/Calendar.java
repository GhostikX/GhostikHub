package org.hokagex.ghostikxGoal.models;

import jakarta.persistence.*;
import org.hokagex.ghostikxGoal.models.user.UserEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "calendar")
public class Calendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 250)
    private String title;

    @Column(nullable = false)
    private LocalDateTime setAt;

    @Column(nullable = false)
    private LocalDateTime reminderAt;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity user;

    public Calendar() {}

    public Calendar( String title, LocalDateTime setAt, LocalDateTime reminderAt, UserEntity user) {
        this.title = title;
        this.setAt = setAt;
        this.reminderAt = reminderAt;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getSetAt() {
        return setAt;
    }

    public void setSetAt(LocalDateTime setAt) {
        this.setAt = setAt;
    }

    public LocalDateTime getReminderAt() {
        return reminderAt;
    }

    public void setReminderAt(LocalDateTime reminderAt) {
        this.reminderAt = reminderAt;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
