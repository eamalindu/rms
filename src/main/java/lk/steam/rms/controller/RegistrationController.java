package lk.steam.rms.controller;

import jakarta.transaction.Transactional;
import lk.steam.rms.dao.InquiryDAO;
import lk.steam.rms.dao.RegistrationDAO;
import lk.steam.rms.dao.RegistrationStatusDAO;
import lk.steam.rms.dao.StudentDAO;
import lk.steam.rms.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
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

    @Autowired
    private InquiryDAO inquiryDAO;

    @GetMapping()
    public ModelAndView registrationUI() {
        ModelAndView registrationView = new ModelAndView();
       registrationView.setViewName("registrations.html");
        return registrationView;
    }

    @PostMapping
    @Transactional
    public String saveNewRegistration(@RequestBody Registrations registrations){

        Registrations existRegistration = registrationDAO.getRegistrationsByBatchIDAndStudentID(registrations.getBatchID().getId(),registrations.getStudentID().getId());

        if(existRegistration!=null){
            return  "This student is already registered to <br>Batch <span class='text-steam-green'>"+existRegistration.getBatchID().getBatchCode()+"</span><small> [Reg Number : <span class='text-steam-green'>"+existRegistration.getRegistrationNumber()+"</span>]</small>";
        }

        try {

            //set registration number
            String regNextNumber = registrationDAO.getNextRegistrationNumber();
            if (regNextNumber == null || regNextNumber.length() == 0 || regNextNumber.isEmpty()) {
                registrations.setRegistrationNumber("00001");
            } else {
                registrations.setRegistrationNumber(regNextNumber);
            }

            registrations.setTimestamp(LocalDateTime.now());
            registrations.setAddedBy("User1");
            registrations.setCommissionPaidTo("User1");

            //check the discountRate and discountAmount is null or not
            if(registrations.getDiscountRate()==null){
                registrations.setDiscountRate(BigDecimal.valueOf(0));
            }
            if(registrations.getDiscountAmount()==null){
                registrations.setDiscountAmount(BigDecimal.valueOf(0));
            }


            //Student sample = studentDAO.getReferenceById(1);
            RegistrationStatus sampleStatus = registrationStatusDAO.getReferenceById(4);
            //registrations.setStudentID(sample);
            registrations.setRegistrationStatusID(sampleStatus);

            //store the current student nic
            String currentIdValue = registrations.getStudentID().getIdValue();

            //check this student exsist
            Student exsistStudent = studentDAO.getStudentsByIdValue(currentIdValue);

            if (exsistStudent == null) {
                return "No Such Student Record";
            } else {

                registrations.setStudentID(exsistStudent);

            }

            //check an inquiry is available for the current registration
            Inquiry currentInquiry = inquiryDAO.getActiveInquiryByIDAndCourseId(registrations.getStudentID().getIdValue(),registrations.getCourseID().getId());
            if(currentInquiry!=null){
                registrations.setInquiryID(currentInquiry.getId());
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
    @GetMapping(value = "getRegistrations/{batchID}",produces = "application/json")
    public List<Registrations> getBatchInfoByBatchCode(@PathVariable Integer batchID){
        return registrationDAO.getRegistrationsByBatchID(batchID);
    }
    @GetMapping(value = "getRegistration/{id}",produces = "application/json")
    public Registrations getRegistrationByID(@PathVariable Integer id){
        return registrationDAO.getRegistrationsByID(id);
    }

    @GetMapping(value = "getRegistrationFromBatchAndStudentNIC/{batchID}/{studentNIC}",produces = "application/json")
    public Registrations getRegistrationFromBatchAndStudentNIC(@PathVariable Integer batchID,@PathVariable String studentNIC){
        return registrationDAO.getRegistrationsByBatchIDAndStudentNIC(batchID,studentNIC);
    }

    @GetMapping(value = "getRegistrationByRegistrationNumber/{registrationNumber}",produces = "application/json")
    public Registrations getRegistrationsByRegistrationNumber(@PathVariable String registrationNumber){
        return registrationDAO.getRegistrationsByRegistrationNumber(registrationNumber);
    }

    @GetMapping(value = "getRegistrationHaveClassToday/{registrationNumber}",produces = "application/json")
    public Registrations getRegistrationHaveClassToday(@PathVariable String registrationNumber){
        return registrationDAO.getRegistrationHaveClassToday(registrationNumber);
    }



    @PutMapping
    public String updateRegistration(@RequestBody Registrations registration){

        //check if the registration exist or not
        Registrations existReg = registrationDAO.getReferenceById(registration.getId());

        if (existReg == null) {
            return "No Such Registration Record";
        }
        try{
            if(registration.getTempRegistrationStatus()!=null){
                registration.setOldRegistrationStatus(registration.getRegistrationStatusID().getId());
                registration.setRegistrationStatusID(registrationStatusDAO.getReferenceById(6));
            }
            registrationDAO.save(registration);
            return "OK";
        }
        catch (Exception ex){
            return "Update Failed " + ex.getMessage();
        }
    }
}

