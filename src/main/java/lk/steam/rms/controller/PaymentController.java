package lk.steam.rms.controller;

import lk.steam.rms.dao.InstallmentPlanDAO;
import lk.steam.rms.dao.PaymentDAO;
import lk.steam.rms.dao.RegistrationDAO;
import lk.steam.rms.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Payment")
public class PaymentController {

    @Autowired
    private PaymentDAO paymentDAO;

    @Autowired
    private RegistrationDAO registrationDAO;

    @Autowired
    private InstallmentPlanDAO installmentPlanDAO;

    @PostMapping
    public String saveNewPayment(@RequestBody Payment payment){


        return "OK";
    }
}
