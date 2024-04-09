package lk.steam.rms.dao;

import lk.steam.rms.entity.Registrations;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationDAO extends JpaRepository<Registrations, Integer> {
}
