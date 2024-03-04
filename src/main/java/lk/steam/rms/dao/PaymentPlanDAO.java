package lk.steam.rms.dao;

import lk.steam.rms.entity.PaymentPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentPlanDAO extends JpaRepository<PaymentPlan,Integer> {

}
