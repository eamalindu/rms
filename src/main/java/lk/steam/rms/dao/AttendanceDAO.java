package lk.steam.rms.dao;

import lk.steam.rms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttendanceDAO extends JpaRepository<Attendance,Integer> {

    @Query(value = "SELECT a from Attendance a where a.batchID=?1")
    List<Attendance> getAttendanceByBatchID(Integer batchID);
}
