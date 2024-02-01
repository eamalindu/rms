package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @Column(name = "batchcode")
    @NotNull
    private String batchCode;

    @Column(name = "commencedate")
    @NotNull
    private LocalDate commenceDate;

    @Column(name = "enddate")
    @NotNull
    private LocalDate endDate;

    @Column(name = "seatcount")
    @NotNull
    private Integer seatCount;

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

    @Column(name = "totalfee")
    @NotNull
    private BigDecimal totalFee;

    @Column(name = "registrationfee")
    @NotNull
    private BigDecimal registrationFee;

    @Column(name = "remainingfee")
    @NotNull
    private BigDecimal courseFee;

    @Column(name = "numberofinstallments")
    @NotNull
    private Integer numberOfInstallments;

    @ManyToOne
    @JoinColumn(name = "course_id",referencedColumnName = "id")
    private Course courseID;

//    private String lectureRoomID;
//    private String lecturerID;

    @ManyToOne
    @JoinColumn(name = "batchstatus_id",referencedColumnName = "id")
    private BatchStatus batchStatusID;

}
