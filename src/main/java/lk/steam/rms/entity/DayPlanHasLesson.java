package lk.steam.rms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "dayplan_has_lesson")
@Data
@AllArgsConstructor
@NoArgsConstructor
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

    @Column(name = "starttime")
    @NotNull
    private LocalTime startTime;

    @Column(name = "endtime")
    @NotNull
    private LocalTime endTime;

    @Column(name = "duration")
    @NotNull
    private Double duration;


}
