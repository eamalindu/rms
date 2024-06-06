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

    public void sendOTPMail(String mail,String otp) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");

        helper.setFrom(username);
        helper.setTo(mail);
        helper.setSubject("Password Reset OTP Confirmation");
        String msgContent = "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "    <title>OTP Email</title>" +
                "    <style>" +
                "        @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');" +
                "        body {" +
                "            font-family: 'Poppins', sans-serif;" +
                "            background-color: #f4f4f4;" +
                "            margin: 0;" +
                "            padding: 0;" +
                "            display:flex;" +
                "            width:100%;" +
                "            height:100vh;" +
                "            align-items:center;" +
                "            justify-content:center;" +
                "        }" +
                "        .container {" +
                "            width: 100%;" +
                "            max-width: 550px;" +
                "            margin: 0 auto;" +
                "            background-color: #ffffff;" +
                "            border-radius: 8px;" +
                "            overflow: hidden;" +
                "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" +
                "        }" +
                "        .header {" +
                "           margin-left: 20px;" +
                "            border-bottom:1px solid #f1f1f1 ;" +
                "        }" +
                "    " +
                "        .content {" +
                "            padding: 20px;" +
                "        }" +
                "        .otp {" +
                "            display: block;" +
                "            width: fit-content;" +
                "            font-size: 24px;" +
                "            font-weight: bold;" +
                "            margin-top: 5px;" +
                "            margin-bottom: 5px;" +
                "                " +
                "        }" +
                "        .footer {" +
                "            background-color: #f4f4f4;" +
                "            padding: 10px;" +
                "            text-align: center;" +
                "            color: #777777;" +
                "            font-size: 14px;" +
                "        }" +
                "        .footer p {" +
                "            margin: 5px 0;" +
                "        }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h2>Password Assistance</h2>" +
                "        </div>" +
                "        <div class='content'>" +
                "            We received a request to reset your password. &nbsp;Your One-Time Password (OTP) for password reset is : " +
                "            <div class='otp'>"+otp+"</div>" +
                "            Please enter this OTP to reset your password. &nbsp;This code is valid for the next 5 minutes." +
                "            <br/><br/>" +
                "            If you did not request a password reset, please ignore this email." +
                "           " +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
        helper.setText(msgContent, true); // true indicates HTML

        javaMailSender.send(message);

    }
}
