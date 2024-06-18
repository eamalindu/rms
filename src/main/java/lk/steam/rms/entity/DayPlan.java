package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    @Column(name = "addedby")
    @NotNull
    private String addedBy;

    @OneToMany(mappedBy = "dayID",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<DayPlanHasLesson> dayPlanHasLessonList;

}
