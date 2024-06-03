package lk.steam.rms.entity;

import jakarta.persistence.*;
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

    private BigDecimal fullPaymentRate;

    private BigDecimal partPaymentRate;

    private String addedBy;

    private LocalDateTime timestamp;
}
