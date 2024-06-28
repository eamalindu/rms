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
@RequestMapping("/Marks-Validation")
public class MarksValidationController {
    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private UserDAO userDAO;

    @GetMapping()
    public ModelAndView marksUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView marksView = new ModelAndView();
        marksView.setViewName("validation.html");

        marksView.addObject("username",auth.getName());
        marksView.addObject("title","Manage Exam Marks | STEAM RMS");
        marksView.addObject("activeNavItem","validation");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        marksView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        marksView.addObject("loggedInDesignationName",loggedInDesignationName);
        marksView.addObject("loggedInImage",imageSrc);
        return marksView;
    }
}
