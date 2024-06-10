package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "batch")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Batch {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "batchnumber")
    @NotNull
    private Integer batchNumber;

    @Column(name = "batchcode")
    @NotNull
    private String batchCode;

    @Column(name = "commencedate")
    @NotNull
    private LocalDate commenceDate;


    @Column(name = "lastregdate")
    @NotNull
    private LocalDate lastRegDate;

    @Column(name = "enddate")
    @NotNull
    private LocalDate endDate;

    @Column(name = "seatcount")
    @NotNull
    private Integer seatCount;

    @Column(name = "availableseatcount")
    @NotNull
    private Integer seatCountAvailable;

    @Column(name = "createdby")
    @NotNull
    private String createdBy;

    @Column(name = "timestamp")
    @NotNull
    private LocalDateTime timestamp;

    @Column(name = "isweekday")
    @NotNull
    private Boolean isWeekday;

    @Column(name = "description")
    @NotNull
    private String description;

    @ManyToOne
    @JoinColumn(name = "course_id",referencedColumnName = "id")
    private Course courseID;

    @ManyToOne
    @JoinColumn(name = "batchstatus_id",referencedColumnName = "id")
    private BatchStatus batchStatusID;

    @ManyToOne
    @JoinColumn(name = "paymentplan_id",referencedColumnName = "id")
    private PaymentPlan paymentPlanID;

    @OneToMany(mappedBy = "batchID",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<BatchHasDay> batchHasDayList;

    @OneToMany(mappedBy = "",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<BatchHasLesson> batchHasLessonList;

}
