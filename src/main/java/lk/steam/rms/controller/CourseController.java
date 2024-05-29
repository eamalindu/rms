package lk.steam.rms.controller;

import lk.steam.rms.dao.CourseDAO;
import lk.steam.rms.entity.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView courseView = new ModelAndView();
        courseView.setViewName("course.html");
        courseView.addObject("username",auth.getName());
        courseView.addObject("title","Manage Courses | STEAM RMS");
        courseView.addObject("activeNavItem","courses");
        return courseView;
    }

    @PostMapping()
    public String saveNewCourse(@RequestBody Course course){
        try {
            course.setStatus(true);
            courseDAO.save(course);
            return "OK";
        }
        catch (Exception ex){
            return "Insert Failed "+ex.getMessage();
        }

    }

}
