package lk.steam.rms.dao;

import lk.steam.rms.entity.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTypeDAO extends JpaRepository<PaymentType,Integer> {
}
