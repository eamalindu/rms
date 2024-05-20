package lk.steam.rms.dao;

import lk.steam.rms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceDAO extends JpaRepository<Attendance,Integer> {
}
