package lk.steam.rms.dao;

import lk.steam.rms.entity.InstallmentPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstallmentPlanDAO extends JpaRepository<InstallmentPlan,Integer> {
}
