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
        loggedInUser.setUsername(user.getUsername());
        loggedInUser.setCurrentPassword(user.getPassword());
        loggedInUser.setEmail(user.getEmail());
        loggedInUser.setPhotoPath(user.getEmployeeID().getPhotoPath());
        return loggedInUser;

    }

    @PutMapping(value = "/loggedInUser")
    public String updateLoggedInUser(@RequestBody User user){
        User currentUser = userDAO.getReferenceById(user.getId());
        if(currentUser==null){
            return "No Such User Account";
        }
        //check duplicate
        String errors = "";

        User existingUserUserName = userDAO.getUserByUsername(user.getUsername());
        if (existingUserUserName != null && !existingUserUserName.getId().equals(user.getId())) {
            errors += "<br>This Username Already Exists";
        }
        if(!errors.isEmpty()){
            return errors;
        }

        try{
            if(bCryptPasswordEncoder.matches(user.getPassword(),currentUser.getPassword())){
                return "<br>Cannot Use the Old Password";
            }
            currentUser.setUsername(user.getUsername());
            currentUser.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

            userDAO.save(user);
            return "OK";
        }
        catch (Exception ex){
            return "Update Failed "+ex.getMessage();
        }

    }
}
