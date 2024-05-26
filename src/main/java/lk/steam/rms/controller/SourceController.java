package lk.steam.rms.controller;

import lk.steam.rms.dao.SourceDAO;
import lk.steam.rms.entity.Source;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/source")
public class SourceController {

    @Autowired
    private SourceDAO sourceDAO;

    @GetMapping(value = "/findall")
    public List<Source> findall(){
        return sourceDAO.findAll();

    }
}
