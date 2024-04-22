package lk.steam.rms.controller;

import lk.steam.rms.dao.StudentDAO;
import lk.steam.rms.entity.Batch;
import lk.steam.rms.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Student")
public class StudentController {

    @Autowired
    private StudentDAO studentDAO;

    @PostMapping
    public String saveNewStudent(@RequestBody Student student){

        student.setStudentNumber("ST-0005");
        try {
            studentDAO.save(student);
            return "OK";
        }
        catch (Exception ex){
            return "Update Failed " + ex.getMessage();
        }

    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Student> findAll() {
        return studentDAO.findAll();
    }

    @GetMapping("getStudentByIdValue/{idValue}")
    public Student getStudentByIdValue(@PathVariable String idValue) {
        return studentDAO.getStudentsByIdValue(idValue);
    }

}
