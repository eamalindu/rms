package lk.steam.rms.dao;

import lk.steam.rms.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentDAO extends JpaRepository<Payment,Integer> {
}
