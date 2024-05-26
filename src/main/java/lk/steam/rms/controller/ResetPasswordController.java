package lk.steam.rms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ResetPasswordController {

    @GetMapping(value = "/Reset-Password")
    public ModelAndView resetPassword() {
        ModelAndView resetView = new ModelAndView();
        return resetView;
    }
}
