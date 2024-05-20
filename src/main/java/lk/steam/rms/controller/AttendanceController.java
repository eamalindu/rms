package lk.steam.rms.controller;

import lk.steam.rms.dao.AttendanceDAO;
import lk.steam.rms.entity.Attendance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/Attendance")
public class AttendanceController {

    @Autowired
    private AttendanceDAO attendanceDAO;

    @GetMapping()
    public ModelAndView attendanceUI() {
        ModelAndView attendanceView = new ModelAndView();
        attendanceView.setViewName("attendance.html");
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

    @PostMapping()
    public String saveNewAttendance(@RequestBody Attendance attendance){
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
