package lk.steam.rms.controller;

import lk.steam.rms.dao.CourseDAO;
import lk.steam.rms.entity.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping(value = "/Course")
public class CourseController {

    @Autowired
    private CourseDAO courseDAO;

    @GetMapping(value = "/findall",produces = "application/json")
    public List<Course> findAll(){
        return courseDAO.findAll();
    }

    @GetMapping()
    public ModelAndView courseUI() {
        ModelAndView courseView = new ModelAndView();
        courseView.setViewName("course.html");
        return courseView;
    }

}
