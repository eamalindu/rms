package lk.steam.rms.controller;

import lk.steam.rms.dao.PrivilegeDAO;
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
        ModelAndView privilegeView = new ModelAndView();
        privilegeView.setViewName("privileges.html");
        return privilegeView;
    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Privilege> findAll() {
        return privilegeDAO.findAll();
    }

    @PostMapping
    public String saveNewPrivilege(@RequestBody Privilege privilege) {
        try {
            privilegeDAO.save(privilege);
            return "OK";
        } catch (Exception ex) {
            return "Save Failed " + ex.getMessage();
        }
    }

    @PutMapping
    public String updatePrivilege(@RequestBody Privilege privilege) {

        //check existing
        Privilege existPrivilege = privilegeDAO.getReferenceById(privilege.getId());

        if (existPrivilege == null) {
            return "No Such Privilege Record";
        }
        try {
            privilegeDAO.save(privilege);
            return "OK";
        } catch (Exception ex) {
            return "Update Failed " + ex.getMessage();
        }
    }

    @DeleteMapping
    public String deletePrivilege(@RequestBody Privilege privilege) {
        try {

            privilegeDAO.delete(privilege);
            return "OK";
        } catch (Exception ex) {
            return "Update Failed " + ex.getMessage();
        }

    }

}
