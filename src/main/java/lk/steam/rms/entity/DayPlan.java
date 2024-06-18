package lk.steam.rms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "dayplan")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DayPlan {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalTime startTime;

    private LocalTime endTime;

    private String addedBy;

    private LocalDateTime timeStamp;

    //lesson id here
}
