package lk.steam.rms.controller;

import lk.steam.rms.dao.ModuleDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "module")
public class ModuleController {

    @Autowired
    private ModuleDAO moduleDAO;

    @GetMapping(value = "/findall",produces = "application/json")
    public List<Module> findAll(){
      return moduleDAO.findAll();
    }
}
