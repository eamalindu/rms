package lk.steam.rms.controller;

import jakarta.transaction.Transactional;
import lk.steam.rms.dao.BatchDAO;
import lk.steam.rms.dao.BatchStatusDAO;
import lk.steam.rms.dao.RegistrationDAO;
import lk.steam.rms.dao.RegistrationStatusDAO;
import lk.steam.rms.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.net.Authenticator;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/Batch")
public class BatchController {

    @Autowired
    private BatchDAO batchDAO;
    @Autowired
    private BatchStatusDAO batchStatusDAO;
    @Autowired
    private RegistrationDAO registrationDAO;
    @Autowired
    private RegistrationStatusDAO registrationStatusDAO;
    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Batch> findAll() {
        return batchDAO.findAll();
    }

    @GetMapping(value = "getActiveWeekDayBatch/{courseId}",produces = "application/json")
    public List<Batch> getActiveWeekDayBatchesByCourseId(@PathVariable Integer courseId) {
        return batchDAO.getActiveWeekDayBatchesByCourseId(courseId);
    }

    @GetMapping(value = "getActiveWeekEndBatch/{courseId}",produces = "application/json")
    public List<Batch> getActiveWeekendBatchesByCourseId(@PathVariable Integer courseId) {
        return batchDAO.getActiveWeekendBatchesByCourseId(courseId);
    }

    @GetMapping(value = "getBatchInfo/{batchCode}",produces = "application/json")
    public List<Batch> getBatchInfoByBatchCode(@PathVariable String batchCode){
        return batchDAO.getBatchInfoByBatchCode(batchCode);
    }

    @GetMapping(value = "getBatchesConductToday",produces = "application/json")
    public List<Batch> getBatchesConductToday(){
        return batchDAO.getBatchesConductToday();
    }


    @GetMapping()
    public ModelAndView batchUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView batchView = new ModelAndView();
        batchView.setViewName("batch.html");

        batchView.addObject("username",auth.getName());
        batchView.addObject("title","Manage Batches | STEAM RMS");
        batchView.addObject("activeNavItem","batches");
        return batchView;
    }

    @PostMapping()
    public String saveNewBatch(@RequestBody Batch batch) {

        Integer currentCourseID = batch.getCourseID().getId();
        String currentCourseCode = batch.getCourseID().getCode();
        LocalDate currentDate = LocalDate.now();
        Integer currentYear = currentDate.getYear();
        Integer nextBatchNumber = batchDAO.getNextBatchNumberByCourseId(currentCourseID);
        Integer lastBatchCodeYear = batchDAO.getLastBatchCodeYearByCourseID(currentCourseID);

        String halfBatchCode = currentYear + "-" + currentCourseCode + "-";

        if (lastBatchCodeYear != null || lastBatchCodeYear == (currentYear)) {
            if (nextBatchNumber != null) {
                batch.setBatchCode(halfBatchCode + nextBatchNumber);


            } else {
                nextBatchNumber = 1;
                batch.setBatchCode(halfBatchCode + nextBatchNumber);


            }
        } else {
            nextBatchNumber = 1;
            batch.setBatchCode(halfBatchCode + nextBatchNumber);

        }

        batch.setTimestamp(LocalDateTime.now());
        batch.setBatchNumber(nextBatchNumber);
        batch.setCreatedBy("Malindu");
        batch.setSeatCountAvailable(batch.getSeatCount());
        batch.setBatchStatusID(batchStatusDAO.getReferenceById(1));

        for(BatchHasDay batchHasDay: batch.getBatchHasDayList()){
            batchHasDay.setBatchID(batch);
        }
        batchDAO.save(batch);
        return "OK";
    }

    @PutMapping
    public String updateBatch(@RequestBody Batch batch) {

        //check existing
        Batch existBatch = batchDAO.getReferenceById(batch.getId());

        //payment plan cannot be changed to another one if registrations are done
        //if the seat count changes available seats also should change
        //this needed to implement here
        if (existBatch == null) {
            return "No Such Privilege Record";
        }
        try {
            for(BatchHasDay batchHasDay: batch.getBatchHasDayList()){
                batchHasDay.setBatchID(batch);
            }
            batchDAO.save(batch);
            return "OK";
        } catch (Exception ex) {
            return "Update Failed " + ex.getMessage();
        }
    }

    @DeleteMapping
    @Transactional
    public String deleteBatch(@RequestBody Batch batch) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"BATCH");

        if(!loggedUserPrivilege.getDeletePrivilege()){
          return "<br>User does not have sufficient privilege.";
        }
        try {
            //soft delete
            //change batch Status to delete
            BatchStatus deleteStatus = batchStatusDAO.getReferenceById(5);
            batch.setBatchStatusID(deleteStatus);

            for(BatchHasDay batchHasDay: batch.getBatchHasDayList()){
                batchHasDay.setBatchID(batch);
            }

            //update the batch record
            batchDAO.save(batch);

            //check weather registrations are present in the batch
            List<Registrations> currentBatchRegistrations = registrationDAO.getRegistrationsByBatchID(batch.getId());

            if(currentBatchRegistrations!=null){
                for(Registrations registration : currentBatchRegistrations){
                    registration.setRegistrationStatusID(registrationStatusDAO.getReferenceById(3));
                    registrationDAO.save(registration);
                }

            }


            return "OK";
        } catch (Exception ex) {
            return "Delete Failed " + ex.getMessage();
        }
    }
}
