package lk.steam.rms.controller;

import lk.steam.rms.dao.InstallmentPlanDAO;
import lk.steam.rms.dao.PaymentDAO;
import lk.steam.rms.dao.RegistrationDAO;
import lk.steam.rms.entity.Payment;
import lk.steam.rms.entity.Registrations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

        //set autogenerated values
        payment.setAddedBy("User1");
        payment.setTimeStamp(LocalDateTime.now());

        paymentDAO.save(payment);

        //setting paidAmount, BalanceAmount of the registration

        Registrations currentRegistration = registrationDAO.getRegistrationsByID(payment.getRegistrationID().getId());
        BigDecimal currentBalance = currentRegistration.getBalanceAmount();
        BigDecimal currentPaidAmount = currentRegistration.getPaidAmount();

        BigDecimal updatedBalance = currentBalance.subtract(payment.getAmount());
        BigDecimal updatedPaidAmount = currentPaidAmount.add(payment.getAmount());

        currentRegistration.setPaidAmount(updatedPaidAmount);
        currentRegistration.setBalanceAmount(updatedBalance);

        registrationDAO.save(currentRegistration);


        return "OK";
    }
}
