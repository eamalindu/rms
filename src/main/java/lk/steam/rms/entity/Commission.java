package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commission")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Commission {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "inquiryid")
    private Integer inquiryID;

    @Column(name = "amount")
    @NotNull
    private BigDecimal amount;

    @Column(name = "paidto")
    @NotNull
    private String paidTo;

    @Column(name = "timestamp")
    @NotNull
    private LocalDateTime timestamp;
}
