package lk.steam.rms.controller;

import lk.steam.rms.dao.MarkDAO;
import lk.steam.rms.entity.Mark;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/Mark")
public class MarkController {

    @Autowired
    private MarkDAO markDAO;

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Mark> findAll() {
        return markDAO.findAll();
    }


}
