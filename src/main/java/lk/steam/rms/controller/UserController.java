package lk.steam.rms.controller;

import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.Privilege;
import lk.steam.rms.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping
    public ModelAndView userUI(){
        ModelAndView userView = new ModelAndView();
        userView.setViewName("user.html");
        return  userView;
    }

    @GetMapping(value = "/getUserByEmail/{email}",produces = "application/json")
    public User getUserByEmail(@PathVariable String email){
        return userDAO.getUserByEmail(email);
    }

    @GetMapping(value = "/findall")
    public List<User> findAll(){
        return userDAO.findAll();
    }

    @PostMapping
    public String saveNewUser(@RequestBody User user){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"USER");
        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"USER");
        if(!loggedUserPrivilege.getUpdatePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"USER");
        if(!loggedUserPrivilege.getDeletePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
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
