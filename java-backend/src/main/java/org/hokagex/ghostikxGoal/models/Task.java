package org.hokagex.ghostikxGoal.models;

import jakarta.persistence.*;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Boolean isCompleted;

    @ManyToOne
    @JoinColumn(name = "target_id", referencedColumnName = "id")
    private Target target;

    public Task() {
    }

    public Task(Long id, String title, Boolean isCompleted, Target target) {
        this.id = id;
        this.title = title;
        this.isCompleted = isCompleted;
        this.target = target;
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

    public Boolean getCompleted() {
        return isCompleted;
    }

    public void setCompleted(Boolean completed) {
        isCompleted = completed;
    }

    public Target getTarget() {
        return target;
    }

    public void setTarget(Target target) {
        this.target = target;
    }

    @PrePersist
    public void prePersist() {
        if (target != null)
            target.setTasksCount(target.getTasksCount() + 1);
    }

    @PreRemove
    public void preRemove() {
        if (target != null)
            target.setTasksCount(target.getTasksCount() - 1);
    }
}
