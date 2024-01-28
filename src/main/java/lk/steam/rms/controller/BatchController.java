package lk.steam.rms.controller;

import lk.steam.rms.dao.BatchDAO;
import lk.steam.rms.entity.Batch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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



}
