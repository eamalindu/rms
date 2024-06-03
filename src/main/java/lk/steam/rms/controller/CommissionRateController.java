package lk.steam.rms.controller;

import lk.steam.rms.dao.CommissionRateDAO;
import lk.steam.rms.entity.CommissionRate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/CommissionRate")
public class CommissionRateController {


    @Autowired
    private CommissionRateDAO commissionRateDAO;


    @GetMapping("/getCommissionRateByCourseID/{courseID}")
    public CommissionRate getCommissionRateByCourseID(@PathVariable Integer courseID){
        return commissionRateDAO.getCommissionRateByCourseID(courseID);
    }
}
