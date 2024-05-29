package lk.steam.rms.controller;

import lk.steam.rms.dao.AttendanceDAO;
import lk.steam.rms.entity.Attendance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/Attendance")
public class AttendanceController {

    @Autowired
    private AttendanceDAO attendanceDAO;

    @GetMapping()
    public ModelAndView attendanceUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView attendanceView = new ModelAndView();
        attendanceView.setViewName("attendance.html");
        attendanceView.addObject("username",auth.getName());
        attendanceView.addObject("title","Attendance | STEAM RMS");
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

    @PostMapping()
    public String saveNewAttendance(@RequestBody Attendance attendance){

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
