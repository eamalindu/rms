package lk.steam.rms.entity;

import jakarta.persistence.*;
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

    private LocalDateTime timeStamp;

    private LocalDate examDate;

    private String addedBy;

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
