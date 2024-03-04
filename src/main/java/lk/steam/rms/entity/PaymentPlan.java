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
@Table(name = "paymentplan")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentPlan {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "registrationfee")
    @NotNull
    private BigDecimal registrationFee;

    @Column(name = "coursefee")
    @NotNull
    private BigDecimal courseFee;

    @Column(name = "totalfee")
    @NotNull
    private BigDecimal totalFee;

    @Column(name = "numberofinstallments")
    @NotNull
    private Integer numberOfInstallments;

    @Column(name = "type")
    @NotNull
    private Boolean type;

    @Column(name = "expiredate")
    @NotNull
    private LocalDate expireDate;

    @Column(name = "timestamp")
    @NotNull
    private LocalDateTime timestamp;

    @Column(name = "createdby")
    @NotNull
    private String createdBy;

    @Column(name = "status")
    @NotNull
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "course_id",referencedColumnName = "id")
    private Course courseID;

}
