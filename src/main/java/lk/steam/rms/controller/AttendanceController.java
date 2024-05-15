package lk.steam.rms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping(value = "/Attendance")
public class AttendanceController {

    @GetMapping()
    public ModelAndView attendanceUI() {
        ModelAndView attendanceView = new ModelAndView();
        attendanceView.setViewName("attendance.html");
        return attendanceView;
    }
}
