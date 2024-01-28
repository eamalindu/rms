package lk.steam.rms.controller;

import lk.steam.rms.dao.BatchDAO;
import lk.steam.rms.entity.Batch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("getBatch/{courseId}")
    public List<Batch> getBatchesByCourseId(@PathVariable Integer courseId) {
        return batchDAO.getBatchesByCourseId(courseId);
    }

}
