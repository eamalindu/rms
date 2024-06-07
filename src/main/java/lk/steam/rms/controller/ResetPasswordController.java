package lk.steam.rms.controller;

import jakarta.mail.MessagingException;
import lk.steam.rms.dao.OtpDAO;
import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.OTP;
import lk.steam.rms.entity.User;
import lk.steam.rms.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@RestController
public class ResetPasswordController {

    @Autowired
    private UserDAO userDAO;
    @Autowired
    private MailService mailService;
    @Autowired
    private OtpDAO otpDAO;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

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

                OTP otp = new OTP();
                otp.setEmail(email);
                otp.setOtp(generatedOTP);
                otp.setCreatedTimestamp(LocalDateTime.now());
                otp.setExpiredTimestamp(otp.getCreatedTimestamp().plusMinutes(5));
                otp.setUserID(user);
                otp.setStatus(true);
                otpDAO.save(otp);
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

    @PostMapping("/Reset-Password/OTP/{email}/{otp}")
    public String checkOTP(@PathVariable String email, @PathVariable String otp) {
        User user = userDAO.getUserByEmail(email);
        if(user==null){
            return "No User Account Found For Provided Email";
        }
        else{
            OTP currentOTP = otpDAO.getOTPByEmailAndOtp(email,otp);
            if(currentOTP==null){
                return "OTP Expired or invalid OTP";
            }
            else{
                currentOTP.setStatus(false);
                otpDAO.save(currentOTP);
                return "OK";

            }
        }

    }

    @PostMapping("/Reset-Password/Update/{email}/{rawPassword}")
    public String updatePassword(@PathVariable String email, @PathVariable String rawPassword){
        try {
            User user = userDAO.getUserByEmail(email);
            if(user==null){
                return "No User Account Found For Provided Email";
            }
            else {
                user.setPassword(bCryptPasswordEncoder.encode(rawPassword));
                userDAO.save(user);

                return "OK";
            }
        }
        catch (Exception e) {
            return e.getMessage();
        }

    }

    public static String generateSecureOTP() {
        SecureRandom secureRandom = new SecureRandom();
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }
}
