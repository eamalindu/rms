package lk.steam.rms.controller;

import lk.steam.rms.dao.LessonDAO;
import lk.steam.rms.entity.Lesson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/Lesson")
public class LessonController {

    @Autowired
    private LessonDAO lessonDAO;

    @GetMapping(value = "/findall",produces = "application/json")
    public List<Lesson> findAll(){
        return lessonDAO.findAll();
    }

    @PostMapping
    public String saveNewLesson(@RequestBody Lesson lesson){
        lessonDAO.save(lesson);
        return "OK";
    }
}
