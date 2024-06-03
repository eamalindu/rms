package lk.steam.rms.dao;

import lk.steam.rms.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface PaymentDAO extends JpaRepository<Payment,Integer> {

    @Query(value = "select p from Payment p where p.registrationID.id=?1")
    List<Payment> getPaymentsByRegistrationID(Integer registrationID);

    @Query(value = "SELECT * FROM steam.payment WHERE DATE(paiddatetime) = date(now())",nativeQuery = true)
    List<Payment> getDailyTotalPayment();

    @Query(value = "SELECT * FROM steam.payment WHERE DATE(paiddatetime) = date(now()) and steam.payment.paymenttype_id=1",nativeQuery = true)
    List<Payment> getDailyTotalCashPayment();

    @Query(value = "SELECT * FROM Payment WHERE paiddatetime >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AND paiddatetime < DATE_FORMAT(CURRENT_DATE + INTERVAL 1 MONTH, '%Y-%m-01')",nativeQuery = true)
    List<Payment> getMonthlyTotalPayment();

    @Query(value = "SELECT * FROM Payment WHERE paiddatetime >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AND paiddatetime < DATE_FORMAT(CURRENT_DATE + INTERVAL 1 MONTH, '%Y-%m-01') and steam.payment.paymenttype_id=1",nativeQuery = true)
    List<Payment> getMonthlyTotalCashPayment();

    @Query(value ="SELECT concat(('R-'),right(year(current_date),2),lpad((substring(max(invoicecode),5)+1) ,4 ,0)) FROM steam.payment where date(paiddatetime)=date(current_date())",nativeQuery = true)
    String getNextInvoiceCode();

    @Query(value = "SELECT distinct p from Payment p")
    List<Payment> getCashiers();

    @Query(value = "SELECT p.* FROM payment p JOIN registration r ON p.registration_id = r.id JOIN batch b ON r.batch_id = b.id WHERE (?1 IS NULL OR r.course_id = ?1) AND (?2 IS NULL OR r.batch_id = ?2) AND (?3 IS NULL OR p.paymenttype_id = ?3) AND (?4 IS NULL OR p.addedby = ?4) AND (?5 IS NULL OR DATE(p.paiddatetime) >= ?5) AND (?6 IS NULL OR DATE(p.paiddatetime) <= ?6)", nativeQuery = true)
    List<Payment> getPaymentsForReport(Integer courseID, Integer batchID, Integer paymentTypeID, String addedBy, String startDate,String endDate);
}
