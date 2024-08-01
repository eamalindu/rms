package lk.steam.rms.controller;

import lk.steam.rms.dao.MarkDAO;
import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.Mark;
import lk.steam.rms.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/Mark")
public class MarkController {

    @Autowired
    private MarkDAO markDAO;
    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private UserDAO userDAO;

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Mark> findAll() {
        return markDAO.findAll();
    }

    @GetMapping(value = "/getByRegistrationID/{registrationID}")
    public List<Mark> getByRegistrationID(@PathVariable Integer registrationID){
        return markDAO.getByRegistrationID(registrationID);
    }

    @GetMapping(value = "/getByBatchID/{batchID}")
    public List<Mark> getByBatchID(@PathVariable Integer batchID){
        return markDAO.getByBatchID(batchID);
    }


    @GetMapping()
    public ModelAndView markUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView examView = new ModelAndView();
        examView.setViewName("exam.html");

        examView.addObject("username",auth.getName());
        examView.addObject("title","Manage Exam Marks | STEAM RMS");
        examView.addObject("activeNavItem","exams");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        examView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        examView.addObject("loggedInDesignationName",loggedInDesignationName);
        examView.addObject("loggedInImage",imageSrc);
        return examView;
    }

    // Save new mark
    @PostMapping
    public String saveNewMark(@RequestBody Mark mark) {
        // Get the logged user's privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "MARK");

        // Check if the logged user has the privilege to insert a new mark
        if (!loggedUserPrivilege.getInsertPrivilege()) {
            return "<br>User does not have sufficient privilege.";
        }
        // Check if the mark already exists
        Mark existMark = markDAO.getMarkByRegistrationIDAndLessonID(mark.getRegistrationID().getId(), mark.getLessonID().getId());

        // If the mark already exists, return an error message
        if (existMark != null) {
            return "<br>Mark already exists.";
        }

        try {
            // Save the new mark
            // Set the added by, is verified and timestamp
            mark.setAddedBy(auth.getName());
            mark.setIsVerified(false);
            mark.setTimeStamp(LocalDateTime.now());
            markDAO.save(mark);
            return "OK";

        }
        // If an exception occurs, return an error message
        catch (Exception ex) {
            return "Save Failed " + ex.getMessage();
        }


    }

    @PutMapping(value = "/verify")
    public String verifyMark(@RequestBody Mark mark) {
        // Get the logged user's privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "MARK");

        // Check if the logged user has the privilege to verify a mark
        if (!loggedUserPrivilege.getUpdatePrivilege()) {
            return "<br>User does not have sufficient privilege.";
        }

        // Check if the mark already exists
        Mark existMark = markDAO.getMarkByRegistrationIDAndLessonID(mark.getRegistrationID().getId(), mark.getLessonID().getId());

        // If the mark does not exist, return an error message
        if (existMark == null) {
            return "<br>Mark does not exist.";
        }

        try {
            // Verify the mark
            // Set the is verified to true
            existMark.setIsVerified(true);
            markDAO.save(existMark);
            return "OK";

        }
        // If an exception occurs, return an error message
        catch (Exception ex) {
            return "Verification Failed " + ex.getMessage();
        }
    }

    @PutMapping()
    public String updateMark(@RequestBody Mark mark) {
        // Get the logged user's privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "MARK");

        // Check if the logged user has the privilege to verify a mark
        if (!loggedUserPrivilege.getUpdatePrivilege()) {
            return "<br>User does not have sufficient privilege.";
        }

        // Check if the mark already exists
        Mark existMark = markDAO.getMarkByRegistrationIDAndLessonID(mark.getRegistrationID().getId(), mark.getLessonID().getId());

        // If the mark does not exist, return an error message
        if (existMark == null) {
            return "<br>Mark does not exist.";
        }

        try {
            markDAO.save(mark);
            return "OK";

        }
        // If an exception occurs, return an error message
        catch (Exception ex) {
            return "Verification Failed " + ex.getMessage();
        }
    }

    @DeleteMapping
    public String deleteMark(@RequestBody Mark mark){
        // Get the logged user's privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "MARK");

        // Check if the logged user has the privilege to verify a mark
        if (!loggedUserPrivilege.getDeletePrivilege()) {
            return "<br>User does not have sufficient privilege.";
        }
        // Check if the mark already exists
        Mark existMark = markDAO.getMarkByRegistrationIDAndLessonID(mark.getRegistrationID().getId(), mark.getLessonID().getId());

        // If the mark does not exist, return an error message
        if (existMark == null) {
            return "<br>Mark does not exist.";
        }

        try {
            markDAO.delete(mark);
            return "OK";

        }
        // If an exception occurs, return an error message
        catch (Exception ex) {
            return "Verification Failed " + ex.getMessage();
        }

    }

}
