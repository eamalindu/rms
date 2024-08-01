package lk.steam.rms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "marks")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Mark {
    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "marks")
    private Integer marks;

    @Column(name = "addedby")
    private String addedBy;

    @Column(name = "isverfied")
    private Boolean isVerified;

    @Column(name = "timestamp")
    private LocalDateTime timeStamp;

    //foreign keys mapping
    @ManyToOne
    @JoinColumn(name = "registration_id",referencedColumnName = "id")
    private Registrations registrationID;

    @ManyToOne
    @JoinColumn(name = "lesson_id",referencedColumnName = "id")
    private Lesson lessonID;

    @ManyToOne
    @JoinColumn(name = "batch_id",referencedColumnName = "id")
    private Batch batchID;


}
