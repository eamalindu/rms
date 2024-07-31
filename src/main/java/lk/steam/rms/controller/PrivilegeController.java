package lk.steam.rms.controller;

import lk.steam.rms.dao.PrivilegeDAO;
import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping(value = "/Privilege")
public class PrivilegeController {

    @Autowired
    private PrivilegeDAO privilegeDAO;
    @Autowired
    private UserDAO userDAO;

    @GetMapping(value = "/byModule/{moduleName}")
    public Privilege getPrivilegeByModule(@PathVariable String moduleName) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return getPrivilegeByUserAndModule(auth.getName(), moduleName);
    }

    public Privilege getPrivilegeByUserAndModule(String username, String moduleName) {
        if (username.equals("Admin")) {
            Boolean select = true;
            Boolean insert = true;
            Boolean update = true;
            Boolean delete = true;

            return new Privilege(select,insert,update,delete);
        }
        else{
            String currentPrivilege = privilegeDAO.getPrivilegesByUserAndModule(username,moduleName);

            String[] privileges = currentPrivilege.split(",");
            Boolean select = privileges[0].equals("1");
            Boolean insert = privileges[1].equals("1");
            Boolean update = privileges[2].equals("1");
            Boolean delete = privileges[3].equals("1");

            return new Privilege(select,insert,update,delete);
        }
    }

    @GetMapping
    public ModelAndView privilegeUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView privilegeView = new ModelAndView();
        privilegeView.setViewName("privileges.html");

        privilegeView.addObject("username",auth.getName());
        privilegeView.addObject("title","Manage Privileges | STEAM IMS");
        privilegeView.addObject("activeNavItem","privilege");
        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        privilegeView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        privilegeView.addObject("loggedInDesignationName",loggedInDesignationName);
        return privilegeView;
    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Privilege> findAll() {
        return privilegeDAO.findAll();
    }

    @PostMapping
    public String saveNewPrivilege(@RequestBody Privilege privilege) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = getPrivilegeByUserAndModule(auth.getName(),"PRIVILEGE");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
        try {

            Privilege existPrivilege = privilegeDAO.getPrivilegeByRoleAndModule(privilege.getRoleID().getId(),privilege.getModuleID().getId());
            if(existPrivilege != null){
                return "<br>Privilege Already Exists";
            }

            privilegeDAO.save(privilege);
            return "OK";
        } catch (Exception ex) {
            return "Save Failed " + ex.getMessage();
        }
    }

    @PutMapping
    public String updatePrivilege(@RequestBody Privilege privilege) {

        //check authentication needs to be added here
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = getPrivilegeByUserAndModule(auth.getName(),"PRIVILEGE");

        if(!loggedUserPrivilege.getUpdatePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }

        //check existing
        Privilege existPrivilege = privilegeDAO.getReferenceById(privilege.getId());

        if (existPrivilege == null) {
            return "No Such Privilege Record";
        }
        try {
            Privilege existPrivileges = privilegeDAO.getPrivilegeByRoleAndModule(privilege.getRoleID().getId(),privilege.getModuleID().getId());
            if(existPrivileges != null){
                return "<br>Privilege Already Exists";
            }

            privilegeDAO.save(privilege);
            return "OK";
        } catch (Exception ex) {
            return "Update Failed " + ex.getMessage();
        }
    }

    @DeleteMapping
    public String deletePrivilege(@RequestBody Privilege privilege) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = getPrivilegeByUserAndModule(auth.getName(),"PRIVILEGE");

        if(!loggedUserPrivilege.getDeletePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
        try {

            privilegeDAO.delete(privilege);
            return "OK";
        } catch (Exception ex) {
            return "Update Failed " + ex.getMessage();
        }

    }

}
