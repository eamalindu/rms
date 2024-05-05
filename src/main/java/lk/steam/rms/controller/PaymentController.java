package lk.steam.rms.controller;

import lk.steam.rms.dao.InstallmentPlanDAO;
import lk.steam.rms.dao.PaymentDAO;
import lk.steam.rms.dao.RegistrationDAO;
import lk.steam.rms.dao.RegistrationStatusDAO;
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

    @Autowired
    private RegistrationStatusDAO registrationStatusDAO;

    @PostMapping
    public String saveNewPayment(@RequestBody Payment payment){

        //set autogenerated values
        payment.setAddedBy("User1");
        payment.setTimeStamp(LocalDateTime.now());
        if(payment.getRegistrationID().getIsFullPayment()){
            payment.setInstallmentID(null);
        }else {

        }

        paymentDAO.save(payment);

        //setting paidAmount, BalanceAmount of the registration

        Registrations currentRegistration = registrationDAO.getRegistrationsByID(payment.getRegistrationID().getId());
        BigDecimal currentBalance = currentRegistration.getBalanceAmount();
        BigDecimal currentPaidAmount = currentRegistration.getPaidAmount();

        BigDecimal updatedBalance = currentBalance.subtract(payment.getAmount());
        BigDecimal updatedPaidAmount = currentPaidAmount.add(payment.getAmount());

        currentRegistration.setPaidAmount(updatedPaidAmount);
        currentRegistration.setBalanceAmount(updatedBalance);

        //change the registration status
        if(currentRegistration.getRegistrationStatusID().getName().equals("Pending")){
            BigDecimal currentRegistrationRegistrationFee = currentRegistration.getBatchID().getPaymentPlanID().getRegistrationFee();
            BigDecimal currentPaymentAmount = payment.getAmount();

            if (updatedPaidAmount.compareTo(currentRegistrationRegistrationFee) >= 0) {
                // currentPaymentAmount is greater than or equal to currentRegistrationRegistrationFee
                // Handle the case where the payment amount is sufficient or more
                currentRegistration.setRegistrationStatusID(registrationStatusDAO.getReferenceById(1));

            }

        }

        registrationDAO.save(currentRegistration);


        return "OK";
    }
}
