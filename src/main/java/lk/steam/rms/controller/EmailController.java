package lk.steam.rms.controller;

import lk.steam.rms.entity.MailStructure;
import lk.steam.rms.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/mail")
public class EmailController {

    @Autowired
    private MailService mailService;

    @PostMapping("/send/{email}")
    public String sendEmail(@PathVariable String email, @RequestBody MailStructure mailStructure) {
        mailService.sendMail(email, mailStructure);
        return "OK";
    }
}
