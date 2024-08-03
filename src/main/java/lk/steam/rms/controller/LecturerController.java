package lk.steam.rms.controller;

import lk.steam.rms.dao.LecturerDAO;
import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.Lecturer;
import lk.steam.rms.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/Lecturer")
public class LecturerController {

    @Autowired
    private LecturerDAO lecturerDAO;
    @Autowired
    private UserDAO userDAO;
    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/getActiveLecturers")
    public List<Lecturer> getActiveLecturers() {
       return lecturerDAO.getActiveLecturers();
    }

    @GetMapping(value = "/findall")
    public List<Lecturer> findAll() {
        return lecturerDAO.findAll();
    }

    @GetMapping()
    public ModelAndView lecturerUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView paymentView = new ModelAndView();
        paymentView.setViewName("lecturer.html");

        paymentView.addObject("username", auth.getName());
        paymentView.addObject("title", "Manage Lectures | STEAM RMS");
        paymentView.addObject("activeNavItem", "lecturer");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();

        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;

        paymentView.addObject("loggedInEmployeeName", loggedInEmployeeName);
        paymentView.addObject("loggedInDesignationName", loggedInDesignationName);
        paymentView.addObject("loggedInImage", imageSrc);
        return paymentView;
    }

    @PostMapping
    public String saveNewLecturer(Lecturer lecturer) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"EMPLOYEE");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
        try {

            Lecturer existLecturer = lecturerDAO.getLecturerByEmployeeID(lecturer.getEmployeeID());

            if(existLecturer != null){
                return "Lecturer already exists";
            }

           lecturer.setLecturerCode(lecturerDAO.getNextLecturerNumber());
           lecturer.setStatus(true);
           lecturerDAO.save(lecturer);
            return "OK";
        }
        catch (Exception ex) {
            return "Save Failed "+ex.getMessage();
        }
    }
}
