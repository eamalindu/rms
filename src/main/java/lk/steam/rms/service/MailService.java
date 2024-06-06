package lk.steam.rms.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lk.steam.rms.entity.MailStructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
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

    public void sendOTPMail(String mail) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");

        helper.setFrom(username);
        helper.setTo(mail);
        helper.setSubject("OTP");
        String msgContent = "";
        helper.setText(msgContent, true); // true indicates HTML

        javaMailSender.send(message);

    }
}
