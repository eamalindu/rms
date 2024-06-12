package lk.steam.rms.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/Marks-Validation")
public class MarksValidationController {

    @GetMapping()
    public ModelAndView marksUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView marksView = new ModelAndView();
        marksView.setViewName("validation.html");

        marksView.addObject("username",auth.getName());
        marksView.addObject("title","Manage Exam Attempts | STEAM RMS");
        marksView.addObject("activeNavItem","exams");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        marksView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        marksView.addObject("loggedInDesignationName",loggedInDesignationName);
        return marksView;
    }
}
