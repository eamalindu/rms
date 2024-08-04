package lk.steam.rms.controller;

import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.LoggedInUser;
import lk.steam.rms.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoggedInUserController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping(value = "/loggedInUser")
    public LoggedInUser getLoggedInUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get logged in user
        User user = userDAO.getUserByUsername(auth.getName());
        LoggedInUser loggedInUser = new LoggedInUser();
        loggedInUser.setId(user.getId());
        loggedInUser.setUsername(user.getUsername());
        loggedInUser.setCurrentPassword(user.getPassword());
        loggedInUser.setEmail(user.getEmail());
        loggedInUser.setAddedTime(user.getAddedTime());
        loggedInUser.setPhotoPath(user.getEmployeeID().getPhotoPath());
        return loggedInUser;

    }

    @PutMapping(value = "/loggedInUser")
    public String updateLoggedInUser(@RequestBody LoggedInUser loggedInUser){
        User currentUser = userDAO.getReferenceById(loggedInUser.getId());
        if(currentUser==null){
            return "No Such User Account";
        }
        //check duplicate
        String errors = "";

        User existingUserUserName = userDAO.getUserByUsername(loggedInUser.getUsername());
        if (existingUserUserName != null && !existingUserUserName.getId().equals(loggedInUser.getId())) {
            errors += "<br>This Username Already Exists";
        }
        if(!errors.isEmpty()){
            return errors;
        }

        try{
            if(bCryptPasswordEncoder.matches(loggedInUser.getNewPassword(),currentUser.getPassword())){
                return "<br>Cannot Use the Old Password";
            }
            currentUser.setUsername(loggedInUser.getUsername());
            currentUser.setPassword(bCryptPasswordEncoder.encode(loggedInUser.getNewPassword()));

            userDAO.save(currentUser);
            return "OK";
        }
        catch (Exception ex){
            return "Update Failed "+ex.getMessage();
        }

    }
}
