package lk.steam.rms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class LoginController {

    @GetMapping(value = "/login")
    public ModelAndView loginUI(){
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("login.html");
        return loginView;
    }

    @GetMapping(value = "/error")
    public ModelAndView errorUI(){
        ModelAndView errorView = new ModelAndView();
        errorView.setViewName("error.html");
        return errorView;
    }
}
