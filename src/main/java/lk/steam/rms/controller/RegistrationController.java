package lk.steam.rms.controller;

import jakarta.transaction.Transactional;
import lk.steam.rms.dao.RegistrationDAO;
import lk.steam.rms.dao.RegistrationStatusDAO;
import lk.steam.rms.dao.StudentDAO;
import lk.steam.rms.entity.Batch;
import lk.steam.rms.entity.RegistrationStatus;
import lk.steam.rms.entity.Registrations;
import lk.steam.rms.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/Registration")
public class RegistrationController {

    @Autowired
    private RegistrationDAO registrationDAO;

    @Autowired
    private StudentDAO studentDAO;

    @Autowired
    private RegistrationStatusDAO registrationStatusDAO;

    @GetMapping()
    public ModelAndView registrationUI() {
        ModelAndView registrationView = new ModelAndView();
       registrationView.setViewName("registrations.html");
        return registrationView;
    }

    @PostMapping
    @Transactional
    public String saveNewRegistration(@RequestBody Registrations registrations){

        try {

            //set InquiryNumber
            String regNextNumber = registrationDAO.getNextRegistrationNumber();
            if (regNextNumber == null || regNextNumber.length() == 0 || regNextNumber.isEmpty()) {
                registrations.setRegistrationNumber("00001");
            } else {
                registrations.setRegistrationNumber(regNextNumber);
            }

            registrations.setTimestamp(LocalDateTime.now());
            registrations.setAddedBy("User1");
            registrations.setCommissionPaidTo("User1");
            //Student sample = studentDAO.getReferenceById(1);
            RegistrationStatus sampleStatus = registrationStatusDAO.getReferenceById(1);
            //registrations.setStudentID(sample);
            registrations.setRegistrationStatusID(sampleStatus);

            //store the current student nic
            String currentIdValue = registrations.getStudentID().getIdValue();

            //check this student exsist
            Student exsistStudent = studentDAO.getStudentsByIdValue(currentIdValue);

            if (exsistStudent == null) {
                Student registeredStudent = registrations.getStudentID();
                //set auto increment values and backend generated values
                registeredStudent.setStudentNumber("ST-0005");
                //save the student
                studentDAO.save(registeredStudent);
                //set that student as the registration
            } else {

                registrations.setStudentID(exsistStudent);

            }

            Registrations completedRegistration = registrationDAO.save(registrations);
            System.out.println(completedRegistration.getId());
            return "OK";

        }
        catch (Exception ex){
            return "Save Failed "+ex.getMessage();
        }

    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Registrations> findAll() {
        //sorting the data DESC format
        Sort sort = Sort.by(Sort.Direction.DESC,"registrationNumber");
        return registrationDAO.findAll(sort);
    }
}
