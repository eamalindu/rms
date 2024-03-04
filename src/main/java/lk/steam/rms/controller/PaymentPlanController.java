package lk.steam.rms.controller;

import lk.steam.rms.dao.PaymentPlanDAO;
import lk.steam.rms.entity.PaymentPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PaymentPlan")
public class PaymentPlanController {
    @Autowired
    private PaymentPlanDAO paymentPlanDAO;

    @GetMapping(value = "/findall",produces = "application/json")
    public List<PaymentPlan> findAll(){
        return paymentPlanDAO.findAll();
    }
}
