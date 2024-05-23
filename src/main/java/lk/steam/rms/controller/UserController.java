package lk.steam.rms.controller;

import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/User")
public class UserController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping
    public ModelAndView userUI(){
        ModelAndView userView = new ModelAndView();
        userView.setViewName("user.html");
        return  userView;
    }

    @GetMapping(value = "/findall")
    public List<User> findAll(){
        return userDAO.findAll();
    }

    @PostMapping
    public String saveNewUser(@RequestBody User user){
        try{
            user.setAddedTime(LocalDateTime.now());
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userDAO.save(user);
            return "OK";
        }
        catch (Exception ex){
            return "Save Failed "+ex.getMessage();
        }

    }

    @PutMapping
    public String updateUser(@RequestBody User user){
        User currentUser = userDAO.getReferenceById(user.getId());
        if(currentUser==null){
            return "No Such User Account";
        }
        try{
            userDAO.save(user);
            return "OK";
        }
        catch (Exception ex){
            return "Update Failed "+ex.getMessage();
        }

    }

    @DeleteMapping
    public String deleteUser(@RequestBody User user){

        //authentication and authorization should be done first
        //check existing
        User currentUser = userDAO.getReferenceById(user.getId());
        if(currentUser==null){
            return "Delete Failed! No Such User";
        }
        try{
            currentUser.setStatus(false);
            userDAO.save(currentUser);

            return "OK";
            //dependencies
        }
        catch (Exception ex){
            return "Delete Failed " + ex.getMessage();
        }

    }
}
