package lk.steam.rms.dao;

import lk.steam.rms.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationStatusDAO extends JpaRepository<RegistrationStatus, Integer> {
}
