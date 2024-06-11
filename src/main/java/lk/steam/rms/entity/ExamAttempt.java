package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "examattempt")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExamAttempt {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "timestamp")
    @NotNull
    private LocalDateTime timeStamp;

    @Column(name = "examdate")
    @NotNull
    private LocalDate examDate;

    @Column(name = "addedby")
    private String addedBy;

    @Transient
    private Boolean isIndividual;

    @ManyToOne
    @JoinColumn(name = "course_id",referencedColumnName = "id")
    private Course courseID;

    @ManyToOne
    @JoinColumn(name = "batch_id",referencedColumnName = "id")
    private Batch batchID;

    @ManyToOne
    @JoinColumn(name = "lesson_id",referencedColumnName = "id")
    private Lesson lessonID;

    @ManyToOne
    @JoinColumn(name = "registration_id",referencedColumnName = "id")
    private Registrations registrationID;




}
