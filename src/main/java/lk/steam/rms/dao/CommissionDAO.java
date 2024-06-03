package lk.steam.rms.dao;

import lk.steam.rms.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommissionDAO extends JpaRepository<Commission, Integer> {
}
