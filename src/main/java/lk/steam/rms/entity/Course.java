package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "course")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name",length = 100)
    @NotNull
    private String name; //100

    @Column(name = "code",length = 5,unique = true)
    @NotNull
    private String code; //5 unique

    @Column(name = "logo")
    @NotNull
    private byte[] logo;

    @Column(name ="minimumrequirements",length = 45)
    @NotNull
    private String minimumRequirement; //45

    @Column(name = "duration")
    @NotNull
    private Integer duration;

    @Column(name = "lecturehours")
    @NotNull
    private Integer lectureHours;

    @Column(name = "status")
    @NotNull
    private Boolean status;

    @ManyToMany
    @JoinTable(name = "course_has_lesson",joinColumns = @JoinColumn(name = "course_id"),inverseJoinColumns = @JoinColumn(name = "lesson_id"))
    private Set<Lesson> lessonList;
}
