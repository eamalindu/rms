package lk.steam.rms.service;

import lk.steam.rms.entity.MailStructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String username;

    public void sendMail(String mail, MailStructure mailStructure) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(username);
        message.setSubject(mailStructure.getSubject());
        message.setText(mailStructure.getMessage());
        message.setTo(mail);
        javaMailSender.send(message);
    }
}
