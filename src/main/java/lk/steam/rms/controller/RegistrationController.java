package lk.steam.rms.controller;

import lk.steam.rms.entity.Registrations;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/Registration")
public class RegistrationController {

    @GetMapping()
    public ModelAndView registrationUI() {
        ModelAndView registrationView = new ModelAndView();
       registrationView.setViewName("registrations.html");
        return registrationView;
    }

    @PostMapping
    public String saveNewRegistration(@RequestBody Registrations registrations){
        return "OK";

    }
}
