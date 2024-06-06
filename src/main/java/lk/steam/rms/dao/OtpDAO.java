package lk.steam.rms.dao;

import lk.steam.rms.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpDAO extends JpaRepository<OTP, Integer> {
}
