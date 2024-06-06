package lk.steam.rms.dao;

import lk.steam.rms.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface OtpDAO extends JpaRepository<OTP, Integer> {

    @Query(value = "SELECT otp from OTP otp where otp.email=?1 and otp.otp=?2 and otp.expiredTimestamp<=now() and otp.status=true")
    OTP getOTPByEmailAndOtp(String email, String otp);
}
