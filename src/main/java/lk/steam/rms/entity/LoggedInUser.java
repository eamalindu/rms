package lk.steam.rms.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoggedInUser {

    private String username;
    private String currentPassword;
    private String newPassword;
    private String email;
    private byte[] photoPath;
}
