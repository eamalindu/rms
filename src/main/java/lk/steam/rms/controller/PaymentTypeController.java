package lk.steam.rms.controller;


import lk.steam.rms.dao.PaymentTypeDAO;
import lk.steam.rms.entity.PaymentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PaymentType")
public class PaymentTypeController {
    @Autowired
    private PaymentTypeDAO paymentTypeDAO;

    @GetMapping(value = "/findall",produces = "application/json")
    public List<PaymentType> findAll(){
        return paymentTypeDAO.findAll();
    }
}
