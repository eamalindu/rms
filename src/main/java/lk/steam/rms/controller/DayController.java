package lk.steam.rms.controller;

import lk.steam.rms.dao.BatchDAO;
import lk.steam.rms.dao.DayDAO;
import lk.steam.rms.entity.Batch;
import lk.steam.rms.entity.Day;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Day")
public class DayController {
    @Autowired
    private DayDAO dayDAO;

    @GetMapping(value = "/findall",produces = "application/json")
    public List<Day> findAll(){
        return dayDAO.findAll();
    }
}
