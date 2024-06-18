package lk.steam.rms.controller;

import lk.steam.rms.dao.LecturerDAO;
import lk.steam.rms.entity.Lecturer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/Lecturer")
public class LecturerController {

    @Autowired
    private LecturerDAO lecturerDAO;

    @GetMapping(value = "/getActiveLecturers")
    public List<Lecturer> getActiveLecturers() {
       return lecturerDAO.getActiveLecturers();
    }
}
