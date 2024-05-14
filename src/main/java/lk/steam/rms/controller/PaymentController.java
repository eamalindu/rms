package lk.steam.rms.controller;

import lk.steam.rms.dao.*;
import lk.steam.rms.entity.Batch;
import lk.steam.rms.entity.Payment;
import lk.steam.rms.entity.Registrations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;

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

    @Autowired
    private BatchDAO batchDAO;

    @PostMapping
    public String saveNewPayment(@RequestBody Payment payment){

        String nextInvoiceCode = paymentDAO.getNextInvoiceCode();
        if(nextInvoiceCode!=null){
            payment.setInvoiceCode(nextInvoiceCode);
        }else{
            LocalDate currentDate = LocalDate.now();
            Integer currentYear = (currentDate.getYear())%100;
            String finalCode = "R-"+currentYear+"0001";
            payment.setInvoiceCode(finalCode);

        }
        //set autogenerated values
        payment.setAddedBy("User1");
        //userDao.getByUserName(auth.getName()).getId();
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

        BigDecimal currentRegistrationRegistrationFee = currentRegistration.getBatchID().getPaymentPlanID().getRegistrationFee();

        //change the registration status
        if(currentRegistration.getRegistrationStatusID().getName().equals("Pending")){
            if (updatedPaidAmount.compareTo(currentRegistrationRegistrationFee) >= 0) {
                // currentPaymentAmount is greater than or equal to currentRegistrationRegistrationFee
                // Handle the case where the payment amount is sufficient or more
                currentRegistration.setRegistrationStatusID(registrationStatusDAO.getReferenceById(1));

            }

        }

        registrationDAO.save(currentRegistration);

        //After the payment need to check if the registration fee is covered
        //if covered particular batch's available seat count should be deducted by 1

        if (updatedPaidAmount.compareTo(currentRegistrationRegistrationFee) >= 0) {
            Batch currentRegistrationBatch = currentRegistration.getBatchID();
            Integer currentBatchAvailableSeatCount = currentRegistrationBatch.getSeatCountAvailable();
            currentRegistrationBatch.setSeatCountAvailable(currentBatchAvailableSeatCount-1);
            batchDAO.save(currentRegistrationBatch);


        }


        return "OK";
    }

    @GetMapping(value = "/getPaymentsByRegistrationID/{registrationID}")
    public List<Payment> getPaymentsByRegistrationID(@PathVariable Integer registrationID){
        return paymentDAO.getPaymentsByRegistrationID(registrationID);
    }

    @GetMapping(value = "/getDailyIncome")
    public Double getDailyIncome(){
        return paymentDAO.getDailyTotalPayment();
    }
}
