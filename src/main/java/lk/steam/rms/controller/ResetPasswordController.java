package lk.steam.rms.controller;

import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping("/{email}")
    public String resetPassword(@PathVariable String email) {
        //check the user account is available for the provided email
        User user = userDAO.getUserByEmail(email);
        //check user account is null or not
        if(user==null){
            //this means user account is not available
            //return an error to the frontend
            return "No User Account Found For Provided Email";
        }
        else{
            //this means user account is present
            //check the user account is active
            if(user.getStatus()){
                //create a OTP
                //send OTP email
                return "OK";

            }
            else{
                //user account is disabled
                //return an error to the front end
                return "This User Account is Disabled<br>Please Contact System Administrator";
            }

        }

    }
}
