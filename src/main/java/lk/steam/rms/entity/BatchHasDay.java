package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "batch_has_day")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchHasDay {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "batch_id",referencedColumnName = "id")
    private Batch batchID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "day_id",referencedColumnName = "id")
    private Day dayID;

    @Column(name = "starttime")
    @NotNull
    private LocalTime startTime;

    @Column(name = "endtime")
    @NotNull
    private LocalTime endTime;

    @OneToOne
    @JoinColumn(name = "lectureroom_id",referencedColumnName = "id")
    private LectureRoom lectureRoomID;
}
