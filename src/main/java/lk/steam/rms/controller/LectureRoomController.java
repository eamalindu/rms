package lk.steam.rms.controller;

import lk.steam.rms.dao.LectureRoomDAO;
import lk.steam.rms.entity.LectureRoom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/LectureRoom")
public class LectureRoomController {
    @Autowired
    private LectureRoomDAO lectureRoomDAO;

    @GetMapping(value = "/findall",produces = "application/json")
    public List<LectureRoom> findAll(){
        return lectureRoomDAO.findAll();
    }
}
