package lk.steam.rms.dao;

import lk.steam.rms.entity.PaymentPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentPlanDAO extends JpaRepository<PaymentPlan,Integer> {

    //get all the active payment plans by course id
    @Query("SELECT p from PaymentPlan p where p.courseID.id=?1 and p.status=true")
    List<PaymentPlan> getPaymentPlanByCourseID(Integer courseId);
}
