package lk.steam.rms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "batch_has_lesson")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchHasLesson {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "batch_id",referencedColumnName = "id")
    @JsonIgnore //ignore property to stop infinity recursion
    private Batch batchID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "lesson_id",referencedColumnName = "id")
    private Lesson lessonID;

    @Column(name = "startdate")
    @NotNull
    private LocalDate startDate;

    @Column(name = "enddate")
    @NotNull
    private LocalDate endDate;

}
