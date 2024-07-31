package lk.steam.rms.controller;

import lk.steam.rms.dao.AttendanceDAO;
import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.Attendance;
import lk.steam.rms.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping(value = "/Attendance")
public class AttendanceController {

    @Autowired
    private AttendanceDAO attendanceDAO;
    @Autowired
    private UserDAO userDAO;
    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping()
    public ModelAndView attendanceUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView attendanceView = new ModelAndView();
        attendanceView.setViewName("attendance.html");
        attendanceView.addObject("username",auth.getName());
        attendanceView.addObject("title","Attendance | STEAM RMS");
        attendanceView.addObject("activeNavItem","attendance");
        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();

        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        attendanceView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        attendanceView.addObject("loggedInDesignationName",loggedInDesignationName);
        attendanceView.addObject("loggedInImage",imageSrc);
        return attendanceView;
    }

    @GetMapping(value = "/findall",produces = "application/json")
    List<Attendance> findAll(){
        return attendanceDAO.findAll();
    }

    @GetMapping(value = "/getAttendanceByBatchID/{batchID}",produces = "application/json")
    List<Attendance> getAttendanceByBatchID(@PathVariable Integer batchID){
        return attendanceDAO.getAttendanceByBatchID(batchID);
    }

    @GetMapping(value = "/getAttendanceByBatchIDForToday/{batchID}",produces = "application/json")
    List<Attendance> getAttendanceByBatchIDForToday(@PathVariable Integer batchID){
        return attendanceDAO.getAttendanceByBatchIDForToday(batchID);
    }

    @GetMapping(value = "/getAttendanceByBatchIDAndRegistrationID/{batchID}/{registrationID}",produces = "application/json")
    Attendance getAttendanceByBatchIDAndRegistrationIDAndDate(@PathVariable Integer batchID, @PathVariable Integer registrationID){
        return attendanceDAO.getAttendanceByBatchIDAndRegistrationID(batchID,registrationID);
    }

    @GetMapping(value = "/getAttendanceByDate/{date}",produces = "application/json")
    List<Attendance> getAttendanceByDate(@PathVariable String date){
        return attendanceDAO.getAttendanceByDate(date);
    }

    @PostMapping()
    public String saveNewAttendance(@RequestBody Attendance attendance){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"ATTENDANCE");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }

        Attendance exsitAttendance = attendanceDAO.getAttendanceByBatchIDAndRegistrationID(attendance.getBatchID(),attendance.getRegistrationID().getId());
        if(exsitAttendance!=null){
            return "Attendance Already Marked!";
        }
        try {
            attendance.setTimeStamp(LocalDateTime.now());
            attendanceDAO.save(attendance);
            return "OK";
        }
        catch (Exception ex){
            return "Save Failed " + ex.getMessage();
        }

    }
}
