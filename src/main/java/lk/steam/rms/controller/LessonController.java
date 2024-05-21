package lk.steam.rms.controller;

import lk.steam.rms.dao.LessonDAO;
import lk.steam.rms.entity.Lesson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Lesson")
public class LessonController {

    @Autowired
    private LessonDAO lessonDAO;

    @GetMapping(value = "/findall",produces = "application/json")
    List<Lesson> findAll(){
        return lessonDAO.findAll();
    }
}
