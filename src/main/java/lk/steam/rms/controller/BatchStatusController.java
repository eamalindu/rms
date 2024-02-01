package lk.steam.rms.controller;

import lk.steam.rms.dao.BatchStatusDAO;
import lk.steam.rms.entity.BatchStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/BatchStatus")
public class BatchStatusController {

    @Autowired
    private BatchStatusDAO batchStatusDAO;

    @GetMapping(value = "/findall")
    public List<BatchStatus> findAll(){
        return batchStatusDAO.findAll();
    }
}
