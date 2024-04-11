package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "installmentplan")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class InstallmentPlan {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "installmentnumber")
    @NotNull
    private Integer installmentNumber;

    @Column(name = "payment")
    @NotNull
    private BigDecimal payment;

    @Column(name = "duedate")
    @NotNull
    private LocalDate dueDate;

    @Column(name = "status")
    @NotNull
    private String status;

    @ManyToOne
    @JoinColumn(name = "registration_id",referencedColumnName = "id")
    private Registrations registrationID;


}
