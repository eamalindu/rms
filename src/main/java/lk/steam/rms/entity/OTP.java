package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OTP {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email")
    @NotNull
    private String email;

    @Column(name = "otp")
    @NotNull
    private String otp;

    @Column(name = "createdtimestamp")
    @NotNull
    private LocalDateTime createdTimestamp;

    @Column(name = "expiredtimestamp")
    @NotNull
    private LocalDateTime expiredTimestamp;

    @Column(name = "status")
    @NotNull
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User userID;
}
