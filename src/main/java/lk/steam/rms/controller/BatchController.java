package lk.steam.rms.controller;

import jakarta.transaction.Transactional;
import lk.steam.rms.dao.*;
import lk.steam.rms.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
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
    @Autowired
    private UserDAO userDAO;

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Batch> findAll() {
        return batchDAO.findAll();
    }

    @GetMapping(value = "getActiveWeekDayBatch/{courseId}", produces = "application/json")
    public List<Batch> getActiveWeekDayBatchesByCourseId(@PathVariable Integer courseId) {
        return batchDAO.getActiveWeekDayBatchesByCourseId(courseId);
    }

    @GetMapping(value = "getActiveWeekEndBatch/{courseId}", produces = "application/json")
    public List<Batch> getActiveWeekendBatchesByCourseId(@PathVariable Integer courseId) {
        return batchDAO.getActiveWeekendBatchesByCourseId(courseId);
    }

    @GetMapping(value = "getBatchInfo/{batchCode}", produces = "application/json")
    public List<Batch> getBatchInfoByBatchCode(@PathVariable String batchCode) {
        return batchDAO.getBatchInfoByBatchCode(batchCode);
    }

    @GetMapping(value = "getBatchesConductToday", produces = "application/json")
    public List<Batch> getBatchesConductToday() {
        return batchDAO.getBatchesConductToday();
    }

    @GetMapping(value = "getBatchesConductTodayByLecturer/{employeeID}", produces = "application/json")
    public List<Batch> getBatchesConductTodayByLecturer(@PathVariable Integer employeeID) {
        return batchDAO.getBatchesConductTodayByLecturer(employeeID);
    }

    @GetMapping(value = "getBatchesByCourseID/{courseID}", produces = "application/json")
    public List<Batch> getBatchesByCourseID(@PathVariable Integer courseID) {
        return batchDAO.getBatchesByCourseID(courseID);
    }


    @GetMapping()
    public ModelAndView batchUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView batchView = new ModelAndView();
        batchView.setViewName("batch.html");

        batchView.addObject("username", auth.getName());
        batchView.addObject("title", "Manage Batches | STEAM RMS");
        batchView.addObject("activeNavItem", "batches");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();

        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;

        batchView.addObject("loggedInEmployeeName", loggedInEmployeeName);
        batchView.addObject("loggedInDesignationName", loggedInDesignationName);
        batchView.addObject("loggedInImage", imageSrc);
        return batchView;
    }

    @PostMapping()
    public String saveNewBatch(@RequestBody Batch batch) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "BATCH");

        if (!loggedUserPrivilege.getInsertPrivilege()) {
            return "<br>User does not have sufficient privilege.";
        }

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
        batch.setCreatedBy(auth.getName());
        batch.setSeatCountAvailable(batch.getSeatCount());
        batch.setBatchStatusID(batchStatusDAO.getReferenceById(1));

        for (BatchHasDay batchHasDay : batch.getBatchHasDayList()) {
            batchHasDay.setBatchID(batch);
        }
        batchDAO.save(batch);
        return "OK";
    }

    @PutMapping
    public String updateBatch(@RequestBody Batch batch) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "BATCH");

        if (!loggedUserPrivilege.getUpdatePrivilege()) {
            return "<br>User does not have sufficient privilege.";
        }

        //check existing
        Batch existBatch = batchDAO.getReferenceById(batch.getId());

        //payment plan cannot be changed to another one if registrations are done
        //if the seat count changes available seats also should change
        //this needed to implement here
        if (existBatch == null) {
            return "No Such Privilege Record";
        }
        try {
            for (BatchHasDay batchHasDay : batch.getBatchHasDayList()) {
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
        //get the logged user and check the privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(), "BATCH");

        //check the privilege for delete
        if (!loggedUserPrivilege.getDeletePrivilege()) {
            //if the user does not have the privilege return a message
            return "<br>User does not have sufficient privilege.";
        }
        //use try catch to handle the exception
        try {
            //soft delete
            //change batch Status to delete
            BatchStatus deleteStatus = batchStatusDAO.getReferenceById(5);
            batch.setBatchStatusID(deleteStatus);
            //update the batch status
            for (BatchHasDay batchHasDay : batch.getBatchHasDayList()) {
                batchHasDay.setBatchID(batch);
            }
            //save the batch record
            batchDAO.save(batch);

            //check weather registrations are present in the batch
            List<Registrations> currentBatchRegistrations = registrationDAO.getRegistrationsByBatchID(batch.getId());
            //if registrations are present change the registration status to delete
            if (currentBatchRegistrations != null) {
                for (Registrations registration : currentBatchRegistrations) {
                    registration.setRegistrationStatusID(registrationStatusDAO.getReferenceById(3));
                    //save the registration
                    registrationDAO.save(registration);
                }
            }
            //return a message
            return "OK";
        }
        //catch the exception
        catch (Exception ex) {
            //return the error message
            return "Delete Failed " + ex.getMessage();
        }
    }
}
