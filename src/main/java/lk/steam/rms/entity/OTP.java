package lk.steam.rms.entity;

import jakarta.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String email;

    private String otp;

    private LocalDateTime createdTimestamp;

    private LocalDateTime expiredTimestamp;

    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User userID;
}
