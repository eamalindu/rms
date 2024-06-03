package lk.steam.rms.dao;

import lk.steam.rms.entity.CommissionRate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommissionRateDAO extends JpaRepository<CommissionRate, Integer> {
}
