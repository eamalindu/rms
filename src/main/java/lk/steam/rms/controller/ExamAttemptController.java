package lk.steam.rms.controller;

import lk.steam.rms.dao.ExamAttemptDAO;
import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.ExamAttempt;
import lk.steam.rms.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/Exam")
public class ExamAttemptController {
    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private UserDAO userDAO;
    @Autowired
    private ExamAttemptDAO examAttemptDAO;

    @GetMapping()
    public ModelAndView examUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView examView = new ModelAndView();
        examView.setViewName("exam.html");

        examView.addObject("username",auth.getName());
        examView.addObject("title","Manage Exam Attempts | STEAM RMS");
        examView.addObject("activeNavItem","exams");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        examView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        examView.addObject("loggedInDesignationName",loggedInDesignationName);
        return examView;
    }

    @PostMapping
    public String saveNewExamAttempt(@RequestBody ExamAttempt examAttempt) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"EXAM");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }

        ExamAttempt existAttempt = examAttemptDAO.findExamAttemptByExamDateAndRegistrationID(examAttempt.getExamDate(),examAttempt.getRegistrationID().getId(),examAttempt.getLessonID().getId());
        if(existAttempt!=null){
            return "<br>An exam attempt for this same lesson and registration already exists!";
        }

        if(examAttempt.getIsIndividual()){
            examAttempt.setAddedBy(auth.getName());
            examAttempt.setTimeStamp(LocalDateTime.now());
            examAttemptDAO.save(examAttempt);
            return "OK";
        }
        else{
            return "multi";
        }

    }

    @GetMapping(value = "/findAll")
    public List<ExamAttempt> findAll(){
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        return examAttemptDAO.findAll(sort);
    }
}
