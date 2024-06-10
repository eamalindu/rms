package lk.steam.rms.controller;

import lk.steam.rms.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/Exam")
public class ExamAttempt {
    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private UserDAO userDAO;

    @GetMapping()
    public ModelAndView examUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView examView = new ModelAndView();
        examView.setViewName("exam.html");

        examView.addObject("username",auth.getName());
        examView.addObject("title","Manage Exam Attempts | STEAM RMS");
        examView.addObject("activeNavItem","exam");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        examView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        examView.addObject("loggedInDesignationName",loggedInDesignationName);
        return examView;
    }
}
