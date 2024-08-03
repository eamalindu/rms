package lk.steam.rms.controller;

import lk.steam.rms.dao.CourseDAO;
import lk.steam.rms.dao.UserDAO;
import lk.steam.rms.entity.Batch;
import lk.steam.rms.entity.BatchHasDay;
import lk.steam.rms.entity.Course;
import lk.steam.rms.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping(value = "/Course")
public class CourseController {

    @Autowired
    private CourseDAO courseDAO;
    @Autowired
    private UserDAO userDAO;
    @Autowired
    private PrivilegeController privilegeController;

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
        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        courseView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        courseView.addObject("loggedInDesignationName",loggedInDesignationName);
        courseView.addObject("loggedInImage",imageSrc);
        return courseView;
    }

    @PostMapping()
    public String saveNewCourse(@RequestBody Course course){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"COURSE");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
        try {
            course.setStatus(true);
            course.setAddedBy(auth.getName());
            course.setTimestamp(LocalDateTime.now());
            courseDAO.save(course);
            return "OK";
        }
        catch (Exception ex){
            return "Insert Failed "+ex.getMessage();
        }

    }

    @PutMapping
    public String updateCourse(@RequestBody Course course) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "COURSE");
        if(!loggedUserPrivilege.getUpdatePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }

        //check existing
        Course existCourse = courseDAO.getReferenceById(course.getId());
        if (existCourse == null) {
            return "No Such Course Record";
        }
        try {
            courseDAO.save(course);
            return "OK";
        } catch (Exception ex) {
            return "Update Failed " + ex.getMessage();
        }
    }

    @DeleteMapping
    public String deleteCourse(@RequestBody Course course){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "COURSE");
        if(!loggedUserPrivilege.getDeletePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
        //check existing
        Course existCourse = courseDAO.getReferenceById(course.getId());
        if (existCourse == null) {
            return "No Such Course Record";
        }
        try {
            course.setStatus(false);
            courseDAO.save(course);
            return "OK";
        } catch (Exception ex) {
            return "Delete Failed " + ex.getMessage();
        }
    }


}
