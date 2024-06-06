package lk.steam.rms.controller;

import jakarta.mail.MessagingException;
import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.User;
import lk.steam.rms.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.security.SecureRandom;

@RestController
public class ResetPasswordController {

    @Autowired
    private UserDAO userDAO;
    @Autowired
    private MailService mailService;

    @GetMapping(value = "/Reset-Password")
    public ModelAndView resetPassword() {
        ModelAndView resetView = new ModelAndView();
        resetView.setViewName("resetpassword");
        return resetView;
    }


    @PostMapping("/Reset-Password/{email}")
    public String resetPassword(@PathVariable String email) throws MessagingException {
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
                //create an OTP
                String generatedOTP = generateSecureOTP();
                mailService.sendOTPMail(email,generatedOTP);
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

    public static String generateSecureOTP() {
        SecureRandom secureRandom = new SecureRandom();
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }
}
