package lk.steam.rms.controller;

import lk.steam.rms.entity.Student;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Student")
public class StudentController {

    @PostMapping
    public String saveNewStudent(@RequestBody Student student){
        return "OK";
    }

}
