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

    //primary key mapping
    @Id
    @Column(name = "id", unique = true)
    //enable auto increment
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "amount")
    @NotNull
    private BigDecimal amount;

    @Column(name = "invoicecode")
    @NotNull
    private String invoiceCode;

    @Column(name = "paiddatetime")
    @NotNull
    private LocalDateTime timeStamp;

    @Column(name = "addedby")
    @NotNull
    private String addedBy;

    @Column(name = "installmentid")
    private Integer installmentID;

    //foreign key mapping
    @ManyToOne
    @JoinColumn(name = "registration_id", referencedColumnName = "id")
    private Registrations registrationID;

    @ManyToOne
    @JoinColumn(name = "paymenttype_id", referencedColumnName = "id")
    private PaymentType paymentTypeID;

}
