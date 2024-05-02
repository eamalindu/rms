package lk.steam.rms.dao;

import lk.steam.rms.entity.InstallmentPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InstallmentPlanDAO extends JpaRepository<InstallmentPlan,Integer> {

    @Query(value = "select i from InstallmentPlan i where i.registrationID.id=?1")
    List<InstallmentPlan> getInstallmentPlanByRegistrationID(Integer registrationID);

}
