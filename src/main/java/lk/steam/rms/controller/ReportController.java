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
@RequestMapping("/Report")
public class ReportController {
    @Autowired
    private UserDAO userDAO;

    @GetMapping()
    public ModelAndView batchUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("report.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Reports | STEAM RMS");
        reportView.addObject("activeNavItem","reports");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        return reportView;
    }


}
