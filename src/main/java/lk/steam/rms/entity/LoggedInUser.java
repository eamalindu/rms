package lk.steam.rms.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoggedInUser {

    private Integer id;
    private String username;
    private String currentPassword;
    private String newPassword;
    private String email;
    private LocalDateTime addedTime;
    private byte[] photoPath;
}
