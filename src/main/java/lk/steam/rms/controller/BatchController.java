package lk.steam.rms.controller;

import lk.steam.rms.dao.BatchDAO;
import lk.steam.rms.dao.BatchStatusDAO;
import lk.steam.rms.entity.Batch;
import lk.steam.rms.entity.BatchStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/Batch")
public class BatchController {

    @Autowired
    private BatchDAO batchDAO;
    @Autowired
    private BatchStatusDAO batchStatusDAO;

    @GetMapping(value = "/findall",produces = "application/json")
    public List<Batch> findAll(){
        return batchDAO.findAll();
    }

    @GetMapping("getActiveWeekDayBatch/{courseId}")
    public List<Batch> getActiveWeekDayBatchesByCourseId(@PathVariable Integer courseId) {
        return batchDAO.getActiveWeekDayBatchesByCourseId(courseId);
    }

    @GetMapping("getActiveWeekEndBatch/{courseId}")
    public List<Batch> getActiveWeekendBatchesByCourseId(@PathVariable Integer courseId) {
        return batchDAO.getActiveWeekendBatchesByCourseId(courseId);
    }
    @GetMapping()
    public ModelAndView batchUI(){
        ModelAndView batchView = new ModelAndView();
        batchView.setViewName("batch.html");
        return batchView;
    }

    @PostMapping()
    public String saveNewBatch(@RequestBody Batch batch){

        Integer currentCourseID = batch.getCourseID().getId();
        String currentCourseCode = batch.getCourseID().getCode();
        LocalDate currentDate = LocalDate.now();
        Integer currentYear = currentDate.getYear();
        Integer nextBatchNumber = batchDAO.getNextBatchNumberByCourseId(currentCourseID);
        Integer lastBatchCodeYear = batchDAO.getLastBatchCodeYearByCourseID(currentCourseID);

        String halfBatchCode = currentYear+"-"+currentCourseCode+"-";

        if(lastBatchCodeYear!=null||lastBatchCodeYear==(currentYear)) {
            if (nextBatchNumber != null) {
                batch.setBatchCode(halfBatchCode + nextBatchNumber);


            } else {
                nextBatchNumber = 1;
                batch.setBatchCode(halfBatchCode + nextBatchNumber);


            }
        }
        else{
                nextBatchNumber = 1;
                batch.setBatchCode(halfBatchCode + nextBatchNumber);

        }

        batch.setTimestamp(LocalDateTime.now());
        batch.setBatchNumber(nextBatchNumber);
        batch.setCreatedBy("Malindu");
        batch.setBatchStatusID(batchStatusDAO.getReferenceById(1));
        batchDAO.save(batch);
        return "OK";
    }

    @PutMapping
    public String updateBatch(@RequestBody Batch batch){

        //check existing
        Batch existBatch =  batchDAO.getReferenceById(batch.getId());

        //payment plan cannot be changed to another one if registrations are done
        //this needed to implement here
        if (existBatch == null) {
            return "No Such Privilege Record";
        }
        try{
            batchDAO.save(batch);
            return "OK";
        }
        catch (Exception ex){
            return "Update Failed "+ex.getMessage();
        }
    }

    @DeleteMapping
    public String deleteBatch(@RequestBody Batch batch){
        try {
            //soft delete
            //change batch Status to delete
            BatchStatus deleteStatus = batchStatusDAO.getReferenceById(4);
            batch.setBatchStatusID(deleteStatus);
            //update the batch record
            batchDAO.save(batch);

            return "OK";
        } catch (Exception ex) {
            return "Delete Failed " + ex.getMessage();
        }
    }
}
