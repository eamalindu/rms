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

    @GetMapping(value = "/getLessonByCode/{lessonCode}",produces = "application/json")
    public Lesson getLessonByCode(@PathVariable String lessonCode){
        return lessonDAO.getLessonByCode(lessonCode);
    }

    @PostMapping
    public String saveNewLesson(@RequestBody Lesson lesson){
        Lesson existLesson = lessonDAO.getLessonByCode(lesson.getCode());
        if(existLesson!=null){
            return "<br>Module with code <span class='text-steam-green'> "+existLesson.getCode()+"</span> Already Exist";
        }
        try {
            lessonDAO.save(lesson);
            return "OK";
        }
        catch (Exception ex){
            return "Save Failed! <br>"+ex.getMessage();
        }

    }
}
