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
public class Registration {

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


}
