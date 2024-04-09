package lk.steam.rms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private Integer id;
    private String registrationNumber;
    private String addedBy;
    private LocalDateTime timestamp;
    private Boolean isFullPayment;
    private String commissionPaidTo;
    private BigDecimal oneTimePaymentAmount;


}
