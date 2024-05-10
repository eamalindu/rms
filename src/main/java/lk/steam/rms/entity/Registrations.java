package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "registration")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Registrations {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "registrationnumber")
    @NotNull
    private String registrationNumber;

    @Column(name = "addedby")
    @NotNull
    private String addedBy;

    @Column(name = "timestamp")
    @NotNull
    private LocalDateTime timestamp;

    @Column(name = "isfullpayment")
    @NotNull
    private Boolean isFullPayment;

    @Column(name = "commisonpaidto")
    @NotNull
    private String commissionPaidTo;

    @Column(name = "onetimepaymentamount")
    private BigDecimal oneTimePaymentAmount;

    @Column(name = "discountrate")
    private BigDecimal discountRate;

    @Column(name = "discountamount")
    private BigDecimal discountAmount;

    @Column(name = "fullamount")
    private BigDecimal fullAmount;

    @Column(name = "paidamount")
    private BigDecimal paidAmount;

    @Column(name = "balanceamount")
    private BigDecimal balanceAmount;

    @Column(name = "overridereason")
    private String overrideReason;

    @ManyToOne
    @JoinColumn(name = "course_id",referencedColumnName = "id")
    private Course courseID;

    @ManyToOne
    @JoinColumn(name = "batch_id",referencedColumnName = "id")
    private Batch batchID;

    @ManyToOne
    @JoinColumn(name = "student_id",referencedColumnName = "id")
    private Student studentID;

    @ManyToOne
    @JoinColumn(name = "registrationstatus_id",referencedColumnName = "id")
    private RegistrationStatus registrationStatusID;


}
