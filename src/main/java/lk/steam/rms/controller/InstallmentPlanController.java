package lk.steam.rms.controller;

import lk.steam.rms.dao.InstallmentPlanDAO;
import lk.steam.rms.dao.RegistrationDAO;
import lk.steam.rms.dao.RegistrationStatusDAO;
import lk.steam.rms.dao.StudentDAO;
import lk.steam.rms.entity.InstallmentPlan;
import lk.steam.rms.entity.RegistrationStatus;
import lk.steam.rms.entity.Registrations;
import lk.steam.rms.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/InstallmentPlan")
public class InstallmentPlanController {
    @Autowired
    private RegistrationDAO registrationDAO;

    @Autowired
    private StudentDAO studentDAO;

    @Autowired
    private RegistrationStatusDAO registrationStatusDAO;

    @Autowired
    private InstallmentPlanDAO installmentPlanDAO;

    @PostMapping
    public String saveNewRegistrationWithInstallments(@RequestBody List<InstallmentPlan> installmentPlanList){

        try{

            Registrations currentRegistration = installmentPlanList.get(0).getRegistrationID();

            //set Registration Number
            String regNextNumber = registrationDAO.getNextRegistrationNumber();
            if (regNextNumber == null || regNextNumber.length() == 0 || regNextNumber.isEmpty()) {
                currentRegistration.setRegistrationNumber("00001");
            } else {
                currentRegistration.setRegistrationNumber(regNextNumber);
            }

            currentRegistration.setTimestamp(LocalDateTime.now());
            currentRegistration.setAddedBy("User1");
            currentRegistration.setCommissionPaidTo("User1");
            //Student sample = studentDAO.getReferenceById(1);
            RegistrationStatus sampleStatus = registrationStatusDAO.getReferenceById(4);
            //registrations.setStudentID(sample);
            currentRegistration.setRegistrationStatusID(sampleStatus);

            //store the current student nic
            String currentIdValue = currentRegistration.getStudentID().getIdValue();

            //check this student exsist
            Student exsistStudent = studentDAO.getStudentsByIdValue(currentIdValue);

            if (exsistStudent == null) {
//                Student registeredStudent = currentRegistration.getStudentID();
//                //set auto increment values and backend generated values
//                registeredStudent.setStudentNumber("ST-0007");
//                registeredStudent.setTimeStamp(LocalDateTime.now());
//                //save the student
//                studentDAO.save(registeredStudent);
                //set that student as the registration
                return "No Such Student Record";
            } else {

                currentRegistration.setStudentID(exsistStudent);

            }
            Registrations completedRegistration = registrationDAO.save(currentRegistration);
            for (InstallmentPlan installmentPlan : installmentPlanList) {
                installmentPlan.setRegistrationID(completedRegistration);
                installmentPlanDAO.save(installmentPlan);
            }



            return "OK";
        }
        catch (Exception ex){
            return "Save Failed "+ex.getMessage();
        }

    }

    @GetMapping(value = "/getInstallmentPlan/{registrationID}")
    public List<InstallmentPlan> getInstallmentPlanByRegistrationID(@PathVariable Integer registrationID){
        return installmentPlanDAO.getInstallmentPlanByRegistrationID(registrationID);

    }
}
