package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "amount")
    @NotNull
    private BigDecimal amount;

    @Column(name="paiddatetime")
    @NotNull
    private LocalDateTime timeStamp;
}
