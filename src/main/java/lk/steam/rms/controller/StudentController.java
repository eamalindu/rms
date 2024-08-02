package lk.steam.rms.controller;

import lk.steam.rms.dao.StudentDAO;
import lk.steam.rms.entity.Batch;
import lk.steam.rms.entity.Privilege;
import lk.steam.rms.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/Student")
public class StudentController {

    @Autowired
    private StudentDAO studentDAO;
    @Autowired
    private PrivilegeController privilegeController;

    @PostMapping
    public String saveNewStudent(@RequestBody Student student){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"STUDENT");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }

        Student existStudent = studentDAO.getStudentsByIdValue(student.getIdValue());
        if(existStudent!=null){
            return "Duplicate NIC Value <br>Student Record Already Exists";
        }

        String nextStudentNumber = studentDAO.getNextStudentNumber();
        if(nextStudentNumber==null){
            nextStudentNumber = "ST-0001";
        }
        student.setStudentNumber(nextStudentNumber);
        student.setTimeStamp(LocalDateTime.now());
        try {
            studentDAO.save(student);
            return "OK";
        }
        catch (Exception ex){
            return "Update Failed " + ex.getMessage();
        }

    }

    @PutMapping()
    public String updateStudent(@RequestBody Student student){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"STUDENT");

        if(!loggedUserPrivilege.getUpdatePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }

        Student existStudent = studentDAO.getStudentsByIdValue(student.getIdValue());
        if(existStudent!=null){
            return "Duplicate NIC Value <br>Student Record Already Exists";
        }
        try {
            studentDAO.save(student);
            return "OK";
        }
        catch (Exception ex){
            return "Update Failed " + ex.getMessage();
        }

    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Student> findAll() {
        return studentDAO.findAll();
    }

    @GetMapping(value = "getStudentByIdValue/{idValue}",produces = "application/json")
    public Student getStudentByIdValue(@PathVariable String idValue) {
        return studentDAO.getStudentsByIdValue(idValue);
    }

    @GetMapping(value = "getStudentsByNicOrStudentNumberOrMobileNumber/{value}",produces = "application/json")
    public Student getStudentsByNicOrStudentNumberOrMobileNumber(@PathVariable String value) {
        return studentDAO.getStudentsByNicOrStudentNumberOrMobileNumber(value);
    }

    @GetMapping(value = "getStudentByStartDateAndEndDate/{startDate}/{endDate}",produces = "application/json")
    public List<Student> getStudentByStartDateAndEndDate(@PathVariable String startDate,@PathVariable String endDate){
        return studentDAO.getStudentByStartDateAndEndDate(startDate,endDate);
    }

    @GetMapping(value = "/edit")
    public ModelAndView studentEdit() {
        ModelAndView studentEditView = new ModelAndView();
        studentEditView.setViewName("studentedit.html");
        return studentEditView;
    }

}
