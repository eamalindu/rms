package lk.steam.rms.dao;

import lk.steam.rms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceDAO extends JpaRepository<Attendance,Integer> {

    @Query(value = "SELECT a from Attendance a where a.batchID=?1")
    List<Attendance> getAttendanceByBatchID(Integer batchID);

    @Query(value = "SELECT a from Attendance a where a.batchID=?1 and date(a.timeStamp)=curdate()")
    List<Attendance> getAttendanceByBatchIDForToday(Integer batchID);

    @Query(value = "SELECT * from attendance where batchid=?1 and registration_id=?2 and date(timestamp)=curdate()",nativeQuery = true)
    Attendance getAttendanceByBatchIDAndRegistrationID(Integer batchID, Integer registrationID);

    @Query(value = "Select * from attendance where date(timestamp)=?1",nativeQuery = true)
    List<Attendance> getAttendanceByDate(String date);
}
