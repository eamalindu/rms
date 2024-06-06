package lk.steam.rms.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MailStructure {
    private String subject;
    private String message;
}
