package lk.steam.rms.dao;

import lk.steam.rms.entity.Batch;
import lk.steam.rms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BatchDAO extends JpaRepository<Batch,Integer> {

    @Query("SELECT b FROM Batch b WHERE b.courseID.id =?1 and b.seatCountAvailable>0 and b.isWeekday = true and (b.batchStatusID.id=1 or b.batchStatusID.id=2) and b.lastRegDate >= curdate() ")
    List<Batch> getActiveWeekDayBatchesByCourseId(Integer courseId);

    @Query("SELECT b FROM Batch b WHERE b.courseID.id =?1 and b.seatCountAvailable>0 and b.isWeekday = false and (b.batchStatusID.id=1 or b.batchStatusID.id=2) and b.lastRegDate >= curdate()")
    List<Batch> getActiveWeekendBatchesByCourseId(Integer courseId);

    @Query("SELECT CAST(SUBSTRING_INDEX(b.batchCode, '-', -1) AS INTEGER) + 1 AS nextBatchCode  FROM Batch b where b.courseID.id=?1 ORDER BY b.id DESC limit 1")
    Integer getNextBatchNumberByCourseId(Integer courseID);

    @Query("SELECT left(b.batchCode,4) as batchCodeYear FROM Batch b where b.courseID.id=?1 ORDER BY b.id DESC limit 1")
    Integer getLastBatchCodeYearByCourseID(Integer courseID);

    @Query("SELECT b FROM Batch b WHERE b.batchCode=?1")
    List<Batch> getBatchInfoByBatchCode(String BatchCode);

    @Query("SELECT b from Batch b JOIN BatchHasDay bhd on b.id = bhd.batchID.id JOIN Day d ON bhd.dayID.id = d.id where d.name = DAYNAME(CURDATE()) and b.batchStatusID.id=2")
    List<Batch> getBatchesConductToday();




}
