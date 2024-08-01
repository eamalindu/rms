package lk.steam.rms.controller;

import lk.steam.rms.dao.MarkDAO;
import lk.steam.rms.entity.Mark;
import lk.steam.rms.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/Mark")
public class MarkController {

    @Autowired
    private MarkDAO markDAO;
    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Mark> findAll() {
        return markDAO.findAll();
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

}
