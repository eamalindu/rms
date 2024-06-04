package lk.steam.rms.controller;

import lk.steam.rms.dao.*;
import lk.steam.rms.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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

    @Autowired
    private InquiryDAO inquiryDAO;
    @Autowired
    private InquiryStatusDAO inquiryStatusDAO;
    @Autowired
    private PrivilegeController privilegeController;

    @PostMapping
    public String saveNewRegistrationWithInstallments(@RequestBody List<InstallmentPlan> installmentPlanList){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"BATCH");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }

        Registrations existRegistration = registrationDAO.getRegistrationsByBatchIDAndStudentID(installmentPlanList.get(0).getRegistrationID().getBatchID().getId(),installmentPlanList.get(0).getRegistrationID().getStudentID().getId());

        if(existRegistration!=null){
            return  "This student is already registered to <br>Batch <span class='text-steam-green'>"+existRegistration.getBatchID().getBatchCode()+"</span><small> [Reg Number : <span class='text-steam-green'>"+existRegistration.getRegistrationNumber()+"</span>]</small>";
        }

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
                return "No Such Student Record";
            } else {

                currentRegistration.setStudentID(exsistStudent);

            }
            //check an inquiry is available for the current registration
            Inquiry currentInquiry = inquiryDAO.getActiveInquiryByIDAndCourseId(currentRegistration.getStudentID().getIdValue(),currentRegistration.getCourseID().getId());
            if(currentInquiry!=null){
                currentRegistration.setInquiryID(currentInquiry.getId());
                currentInquiry.setInquiryStatusId(inquiryStatusDAO.getReferenceById(3));
                currentInquiry.setRegistrationID(currentRegistration.getId());
                inquiryDAO.save(currentInquiry);
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

    @GetMapping(value = "/getInstallmentPlan/{registrationID}",produces = "application/json")
    public List<InstallmentPlan> getInstallmentPlanByRegistrationID(@PathVariable Integer registrationID){
        return installmentPlanDAO.getInstallmentPlanByRegistrationID(registrationID);

    }

    @GetMapping(value = "/getDueInstallmentAmountFromRegistrationID/{registrationID}",produces = "application/json")
    public BigDecimal getDueInstallmentAmountFromRegistrationID(@PathVariable Integer registrationID){
        return installmentPlanDAO.getDueInstallmentAmountFromRegistrationID(registrationID);
    }
}
