package lk.steam.rms.controller;

import lk.steam.rms.dao.InquiryDAO;
import lk.steam.rms.entity.Inquiry;
import lk.steam.rms.entity.InquiryStatus;
import lk.steam.rms.entity.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/inquiry")
public class InquiryController {

    @Autowired
    private InquiryDAO inquiryDAO;
    @Autowired
    private PrivilegeController privilegeController;

    //data returnType => 'produces ="application/JSON"'
    //it can be either JSON,Text and XML

    //value = 'employee/findall' (<= how the browser will display it)
    // employee is added from the class level mapping
    @GetMapping(value = "/findall",produces = "application/json")
    public List<Inquiry> findAll(){
        return inquiryDAO.findAll();
    }

    @GetMapping(value = "/active",produces = "application/json")
    public List<Inquiry> findActiveInquiry(){
         return inquiryDAO.findActiveInquiry();
    }

    @GetMapping(value = "/registered",produces = "application/json")
    public List<Inquiry> findRegisteredInquiry(){
        return inquiryDAO.findRegisteredInquiry();
    }

    @GetMapping(value = "/dropped",produces = "application/json")
    public List<Inquiry> findDroppedInquiry(){
        return inquiryDAO.findDroppedInquiry();
    }

    @GetMapping(value = "/newInquiry",produces = "application/json")
    public List<Inquiry> findNewInquiry(){
        return inquiryDAO.findNewInquiry();
    }


    @GetMapping(value = "/test",produces = "application/json")
    public List<Map<String,Object>> test(){
        return inquiryDAO.test();
    }

    @GetMapping(value = "/test2",produces = "application/json")
    public List<Map<String,Object>> test2(){
        return inquiryDAO.test2();
    }

    @GetMapping(value = "/newinquirycount",produces = "application/json")
    public String newInquiryCount(){
        return inquiryDAO.getNewInquiryCount();
    }

    @PostMapping
    public String saveNewInquiry(@RequestBody Inquiry inquiry){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"INQUIRY");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
        //check unique properties (They cant be already exist on the table)
        //no unique properties in this table
        try {

            //set autogenerated values
            inquiry.setAddedBy(auth.getName());
            inquiry.setTimeStamp(LocalDateTime.now());

            //set inquiryStatus as 1 (New Inquiry)
            inquiry.setInquiryStatusId(new InquiryStatus(1,"New Inquiry"));

            //set InquiryNumber
            String inqNextNumber = inquiryDAO.getNextInquiryNumber();

            if(inqNextNumber==null||inqNextNumber.length()==0||inqNextNumber.isEmpty()){
                inquiry.setInquiryNumber("000001");
            }
            else{
                inquiry.setInquiryNumber(inqNextNumber);
            }


            inquiryDAO.save(inquiry);
            return "OK";
        }
        catch (Exception ex){
            return "Save Failed "+ex.getMessage();
        }
    }


    @PutMapping
    public String updateInquiry(@RequestBody Inquiry inquiry){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"INQUIRY");

        if(!loggedUserPrivilege.getUpdatePrivilege()){
            return "<br>User does not have sufficient privilege.";
        }
        try {
            //no need to check anything, because there are no any unique values
            inquiryDAO.save(inquiry);
            return "OK";

        }
        catch (Exception ex){
            return "Update Failed "+ex.getMessage();
        }

    }

}
