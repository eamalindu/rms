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
@RequestMapping(value = "Administration")
public class AdministrationController {

    @Autowired
    private UserDAO userDAO;


    @GetMapping()
    public ModelAndView administrationUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView adminView = new ModelAndView();
        adminView.setViewName("administration.html");

        adminView.addObject("username",auth.getName());
        adminView.addObject("title","Administration Portal | STEAM RMS");
        adminView.addObject("activeNavItem","administrations");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;

        adminView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        adminView.addObject("loggedInDesignationName",loggedInDesignationName);
        adminView.addObject("loggedInImage",imageSrc);
        return adminView;
    }
}
