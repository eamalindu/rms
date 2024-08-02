package lk.steam.rms.controller;

import lk.steam.rms.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Base64;

@RestController
@RequestMapping("/Lecturer-Log")

public class DayPlanController {

    @Autowired
    private UserDAO userDAO;


    @GetMapping()
    public ModelAndView dayPlanUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView dayPlanView = new ModelAndView();
        dayPlanView.setViewName("dayplan.html");

        dayPlanView.addObject("username",auth.getName());
        dayPlanView.addObject("title","Daily Schedule | STEAM RMS");
        dayPlanView.addObject("activeNavItem","dayPlan");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        dayPlanView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        dayPlanView.addObject("loggedInDesignationName",loggedInDesignationName);
        dayPlanView.addObject("loggedInImage",imageSrc);
        return dayPlanView;
    }

}
