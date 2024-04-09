package lk.steam.rms.controller;

import jakarta.servlet.Registration;
import lk.steam.rms.dao.RegistrationDAO;
import lk.steam.rms.entity.Registrations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/Registration")
public class RegistrationController {

    @Autowired
    private RegistrationDAO registrationDAO;
    @GetMapping()
    public ModelAndView registrationUI() {
        ModelAndView registrationView = new ModelAndView();
       registrationView.setViewName("registrations.html");
        return registrationView;
    }

    @PostMapping
    public String saveNewRegistration(@RequestBody Registrations registrations){

        registrations.setRegistrationNumber("00001");
        registrations.setTimestamp(LocalDateTime.now());
        registrations.setAddedBy("User1");
        registrations.setCommissionPaidTo("User1");
        registrationDAO.save(registrations);
        return "OK";

    }
}
