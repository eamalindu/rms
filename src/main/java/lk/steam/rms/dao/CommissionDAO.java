package lk.steam.rms.dao;

import lk.steam.rms.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CommissionDAO extends JpaRepository<Commission, Integer> {

    @Query("select c from Commission c where c.registrationID.id=?1")
    Commission findCommissionByRegistrationID(Integer registrationID);
}
