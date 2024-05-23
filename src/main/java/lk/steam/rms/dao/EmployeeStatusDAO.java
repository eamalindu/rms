package lk.steam.rms.dao;

import lk.steam.rms.entity.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeStatusDAO extends JpaRepository<EmployeeStatus,Integer> {
}
