package lk.steam.rms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "dayplan_has_lesson")
public class DayPlanHasLesson {
    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "dayplan_id",referencedColumnName = "id")
    @JsonIgnore //ignore property to stop infinity recursion
    private DayPlan dayPlanID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "lesson_id",referencedColumnName = "id")
    private Lesson lessonID;
}
