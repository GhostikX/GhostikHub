package org.hokagex.ghostikxGoal.models;

import jakarta.persistence.*;
import org.hokagex.ghostikxGoal.models.user.UserEntity;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "target")
public class Target {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(nullable = false)
    private Integer tasksCount;

    @Column(nullable = false)
    private Integer progress;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity user;

    @OneToMany(mappedBy = "target", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;

    public Target() {
    }

    public Target(Long id, String title, LocalDateTime createdAt, LocalDateTime deadline, Integer taskCount, Integer progress, UserEntity user, List<Task> tasks) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.deadline = deadline;
        this.tasksCount = taskCount;
        this.progress = progress;
        this.user = user;
        this.tasks = tasks;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public Integer getTasksCount() {
        return tasksCount;
    }

    public void setTasksCount(Integer taskCount) {
        this.tasksCount = taskCount;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
