package lk.steam.rms.controller;

import lk.steam.rms.dao.BatchDAO;
import lk.steam.rms.entity.Batch;
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

    @GetMapping(value = "/findall",produces = "application/json")
    public List<Batch> findAll(){
        return batchDAO.findAll();
    }

    @GetMapping("getWeekDayBatch/{courseId}")
    public List<Batch> getWeekDayBatchesByCourseId(@PathVariable Integer courseId) {
        return batchDAO.getWeekDayBatchesByCourseId(courseId);
    }

    @GetMapping("getWeekEndBatch/{courseId}")
    public List<Batch> getWeekendBatchesByCourseId(@PathVariable Integer courseId) {
        return batchDAO.getWeekendBatchesByCourseId(courseId);
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
        batch.setDescription("Test");
        batch.setBatchNumber(nextBatchNumber);
        batch.setCreatedBy("Malindu");
        batchDAO.save(batch);
        return "OK";
    }
}
