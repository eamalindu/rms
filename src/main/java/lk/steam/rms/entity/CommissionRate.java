package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commsionrate")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommissionRate {
    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fullpaymentrate")
    @NotNull
    private BigDecimal fullPaymentRate;

    @Column(name = "partpaymentrate")
    @NotNull
    private BigDecimal partPaymentRate;

    @Column(name = "addedby")
    @NotNull
    private String addedBy;

    @Column(name = "timestamp")
    @NotNull
    private LocalDateTime timestamp;

    @OneToOne
    @JoinColumn(name = "course_id",referencedColumnName = "id")
    private Course courseID;
}
