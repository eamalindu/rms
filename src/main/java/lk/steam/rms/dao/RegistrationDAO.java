package lk.steam.rms.dao;

import lk.steam.rms.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationDAO extends JpaRepository<Registration, Integer> {
}
