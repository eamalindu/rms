package lk.steam.rms.controller;

import lk.steam.rms.dao.EmployeeDAO;
import lk.steam.rms.dao.EmployeeStatusDAO;
import lk.steam.rms.entity.Employee;
import lk.steam.rms.entity.EmployeeStatus;
import lk.steam.rms.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/Employee")
public class EmployeeController {

    @Autowired
    private EmployeeDAO employeeDAO;
    @Autowired
    private EmployeeStatusDAO employeeStatusDAO;
    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping
    public ModelAndView employeeUI() {
        ModelAndView employeeView = new ModelAndView();
        employeeView.setViewName("employee.html");
        return employeeView;
    }

    @GetMapping(value = "/findall",produces = "application/json")
    public List<Employee> findAll(){

        return employeeDAO.findAll();
    }

    @GetMapping(value = "/GetEmployeesWithoutUserAccount",produces = "application/json")
    public List<Employee> getEmployeesWithoutUserAccount(){

        return employeeDAO.getEmployeesWithoutUserAccount();
    }

    @PutMapping
    public String updateEmployee(@RequestBody Employee employee){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"BATCH");

        if(!loggedUserPrivilege.getUpdatePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
        try {
            //no need to check anything, because there are no any unique values
            employeeDAO.save(employee);
            return "OK";

        }
        catch (Exception ex){
            return "Update Failed "+ex.getMessage();
        }

    }
    @PostMapping
    public String saveNewEmployee(@RequestBody Employee employee){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"BATCH");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
        try{
            //set auto generated values
            employee.setAdded_timestamp(LocalDateTime.now());
            employee.setEmployeeID("EMP005");

            employeeDAO.save(employee);
            return "OK";
        }
        catch (Exception ex){
            return "Save Failed "+ex.getMessage();
        }

    }
    @DeleteMapping
    public String deleteEmployee(@RequestBody Employee employee) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"BATCH");

        if(!loggedUserPrivilege.getDeletePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }

        try {
            //soft delete
            //change employee Status to delete
            EmployeeStatus deleteStatus = employeeStatusDAO.getReferenceById(3);
            employee.setEmployeeStatusID(deleteStatus);
            //update the employee record
            employeeDAO.save(employee);

            return "OK";
        } catch (Exception ex) {
            return "Delete Failed " + ex.getMessage();
        }
    }

}
