package lk.steam.rms.controller;

import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ResetPasswordController {

    @Autowired
    private UserDAO userDAO;

    @GetMapping(value = "/Reset-Password")
    public ModelAndView resetPassword() {
        ModelAndView resetView = new ModelAndView();
        resetView.setViewName("resetpassword");
        return resetView;
    }

    @GetMapping(value = "/Reset-Password/getUserByEmail/{email}")
    User getUSerByEmail(@PathVariable String email) {
        return userDAO.getUserByEmail(email);
    }
}
