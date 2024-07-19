package lk.steam.rms.controller;

import jakarta.transaction.Transactional;
import lk.steam.rms.dao.*;
import lk.steam.rms.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    @Autowired
    private CommissionRateDAO commissionRateDAO;
    @Autowired
    private CommissionDAO commissionDAO;
    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private InquiryDAO inquiryDAO;
    @Autowired
    private InquiryStatusDAO inquiryStatusDAO;

    @PostMapping
    @Transactional
    public String saveNewPayment(@RequestBody Payment payment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByUserAndModule(auth.getName(),"PAYMENT");

        if(!loggedUserPrivilege.getInsertPrivilege()){
            return "<br>User does not have sufficient privilege.";
        }

        String nextInvoiceCode = paymentDAO.getNextInvoiceCode();
        if (nextInvoiceCode != null) {
            payment.setInvoiceCode(nextInvoiceCode);
        } else {
            LocalDate currentDate = LocalDate.now();
            Integer currentYear = (currentDate.getYear()) % 100;
            String finalCode = "R-" + currentYear + "0001";
            payment.setInvoiceCode(finalCode);

        }
        //set autogenerated values
        payment.setAddedBy(auth.getName());
        //userDao.getByUserName(auth.getName()).getId();
        payment.setTimeStamp(LocalDateTime.now());
        if (payment.getRegistrationID().getIsFullPayment()) {
            payment.setInstallmentID(null);
        } else {

            //handle part payment installments
            List<InstallmentPlan> currentRegistrationInstallments = installmentPlanDAO.getInstallmentPlanByRegistrationID(payment.getRegistrationID().getId());

            BigDecimal remainingAmount = payment.getAmount();
            for (InstallmentPlan installment : currentRegistrationInstallments) {
                if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
                    break;
                }

                BigDecimal balance = installment.getBalanceAmount();
                if (balance.compareTo(BigDecimal.ZERO) > 0) {
                    if (balance.compareTo(remainingAmount) <= 0) {
                        installment.setPaidAmount(installment.getPaidAmount().add(balance));
                        installment.setBalanceAmount(BigDecimal.ZERO);
                        installment.setStatus("Paid");
                        remainingAmount = remainingAmount.subtract(balance);
                    } else {
                        installment.setPaidAmount(installment.getPaidAmount().add(remainingAmount));
                        installment.setBalanceAmount(balance.subtract(remainingAmount));
                        installment.setStatus("Partially Paid");
                        remainingAmount = BigDecimal.ZERO;
                    }
                    installmentPlanDAO.save(installment);
                }
            }

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
        if (currentRegistration.getRegistrationStatusID().getName().equals("Pending")) {
            if (updatedPaidAmount.compareTo(currentRegistrationRegistrationFee) >= 0) {
                // currentPaymentAmount is greater than or equal to currentRegistrationRegistrationFee
                // Handle the case where the payment amount is sufficient or more
                currentRegistration.setRegistrationStatusID(registrationStatusDAO.getReferenceById(1));

                //check this registration already have a commission
                Commission existCommission = commissionDAO.getCommissionByRegistrationID(currentRegistration.getId());

                if (existCommission == null) {
                    //calculate commission
                    //get commission rate for the registration
                    CommissionRate currrentCommissionRate = commissionRateDAO.getCommissionRateByCourseID(currentRegistration.getCourseID().getId());
                    BigDecimal fullCommission = currrentCommissionRate.getFullPaymentRate();
                    BigDecimal partCommission = currrentCommissionRate.getPartPaymentRate();
                    //create a new object
                    Commission newCommission = new Commission();
                    newCommission.setTimestamp(LocalDateTime.now());
                    newCommission.setRegistrationID(currentRegistration);

                    //check inquiry is available
                    if (currentRegistration.getInquiryID() != null) {
                        Inquiry currentInquiry = inquiryDAO.getReferenceById(currentRegistration.getInquiryID());
                        newCommission.setPaidTo(currentInquiry.getAddedBy());
                        currentInquiry.setInquiryStatusId(inquiryStatusDAO.getReferenceById(5));
                        currentInquiry.setRegistrationDateTime(LocalDateTime.now());
                        inquiryDAO.save(currentInquiry);

                    } else {
                        newCommission.setPaidTo(currentRegistration.getCommissionPaidTo());
                    }

                    if (currentRegistration.getIsFullPayment()) {
                        newCommission.setAmount(fullCommission);
                    } else {
                        newCommission.setAmount(partCommission);
                    }

                    commissionDAO.save(newCommission);
                }


            }

        }

        registrationDAO.save(currentRegistration);

        //After the payment need to check if the registration fee is covered
        //if covered particular batch's available seat count should be deducted by 1

        if (updatedPaidAmount.compareTo(currentRegistrationRegistrationFee) >= 0) {
            Batch currentRegistrationBatch = currentRegistration.getBatchID();
            Integer currentBatchAvailableSeatCount = currentRegistrationBatch.getSeatCountAvailable();
            currentRegistrationBatch.setSeatCountAvailable(currentBatchAvailableSeatCount - 1);
            batchDAO.save(currentRegistrationBatch);


        }


        return "OK";
    }


    @GetMapping(value = "/getPaymentsByRegistrationID/{registrationID}", produces = "application/json")
    public List<Payment> getPaymentsByRegistrationID(@PathVariable Integer registrationID) {
        return paymentDAO.getPaymentsByRegistrationID(registrationID);
    }

    @GetMapping(value = "/getDailyIncome", produces = "application/json")
    public List<Payment> getDailyIncome() {
        return paymentDAO.getDailyTotalPayment();
    }

    @GetMapping(value = "/getDailyTotalCashPayment", produces = "application/json")
    public List<Payment> getDailyTotalCashPayment() {
        return paymentDAO.getDailyTotalCashPayment();
    }

    @GetMapping(value = "/getMonthlyTotalPayment", produces = "application/json")
    public List<Payment> getMonthlyTotalPayment() {
        return paymentDAO.getMonthlyTotalPayment();
    }

    @GetMapping(value = "/getMonthlyTotalCashPayment", produces = "application/json")
    public List<Payment> getMonthlyTotalCashPayment() {
        return paymentDAO.getMonthlyTotalCashPayment();
    }

    @GetMapping(value = "/getPaymentsByStartDateAndEndDate/{startDate}/{endDate}", produces = "application/json")
    public List<Payment> getPaymentsByStartDateAndEndDate(@PathVariable String startDate, @PathVariable String endDate) {
        return paymentDAO.getPaymentsByStartDateAndEndDate(startDate, endDate);
    }

    @GetMapping(value = "getPaymentsByDate/{date}", produces = "application/json")
    public List<Payment> getPaymentsByDate(@PathVariable String date) {
        return paymentDAO.getPaymentsByDate(date);
    }

    @GetMapping(value = "/getCashiers", produces = "application/json")
    public List<String> getCashiers() {
        return paymentDAO.getCashiers();
    }

    @GetMapping(value = "/getPaymentsForReport", produces = "application/json")
    public List<Payment> getPaymentsForReport(
            @RequestParam(required = false) Integer courseID,
            @RequestParam(required = false) Integer batchID,
            @RequestParam(required = false) Integer paymentType,
            @RequestParam(required = false) String addedBy,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return paymentDAO.getPaymentsForReport(courseID, batchID, paymentType, addedBy, startDate, endDate);
    }

}
