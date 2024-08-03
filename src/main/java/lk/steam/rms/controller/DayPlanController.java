package lk.steam.rms.controller;

import lk.steam.rms.dao.DayPlanDAO;
import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/Lecturer-Log")

public class DayPlanController {

    @Autowired
    private UserDAO userDAO;
    @Autowired
    private DayPlanDAO dayPlanDAO;
    @Autowired
    private PrivilegeController privilegeController;


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

    @GetMapping("/getLectureLogsForLecturer")
    public List<DayPlan> getLectureLogsForLecturer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return dayPlanDAO.getLectureLogsForLecturer(auth.getName());
    }

    @PostMapping()
    public String saveNewDayPlan(@RequestBody DayPlan dayPlan){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "BATCH");

        if (!loggedUserPrivilege.getInsertPrivilege()) {
            return "<br>User does not have sufficient privilege.";
        }

        //check duplicate
        DayPlan existDayPlan = dayPlanDAO.getLectureLogByDateAndBatchAndAddedBy(dayPlan.getBatchID().getId(),auth.getName());
        if(existDayPlan != null){
            return "<br>Lecture Log already added for today.";
        }

            dayPlan.setAddedBy(auth.getName());
            dayPlan.setTimestamp(LocalDateTime.now());

        for (DayPlanHasLesson dayPlanHasLesson : dayPlan.getDayPlanHasLessonList()) {
            dayPlanHasLesson.setDayPlanID(dayPlan);
        }

            dayPlanDAO.save(dayPlan);

        return "OK";
    }

}
