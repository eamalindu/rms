package lk.steam.rms.controller;

import lk.steam.rms.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class LoginController {

    @Autowired
    private UserDAO userDAO;

    @GetMapping(value = "/login")
    public ModelAndView loginUI(){
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("login.html");
        return loginView;
    }

    @GetMapping(value = "/error")
    public ModelAndView errorUI(){
        ModelAndView errorView = new ModelAndView();
        errorView.setViewName("error.html");
        return errorView;
    }

    @GetMapping(value = "/Dashboard")
    public ModelAndView dashboardUI(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView dashboardView = new ModelAndView();
        dashboardView.setViewName("dashboard.html");
        dashboardView.addObject("username",auth.getName());
        dashboardView.addObject("title","Dashboard | STEAM RMS");
        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        dashboardView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        dashboardView.addObject("loggedInDesignationName",loggedInDesignationName);
        return dashboardView;
    }
}
