package lk.steam.rms.dao;

import lk.steam.rms.entity.Batch;
import lk.steam.rms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BatchDAO extends JpaRepository<Batch,Integer> {

    @Query("SELECT b FROM Batch b WHERE b.courseID.id =?1 and b.isWeekday = true")
    List<Batch> getWeekDayBatchesByCourseId(Integer courseId);

    @Query("SELECT b FROM Batch b WHERE b.courseID.id =?1 and b.isWeekday = false")
    List<Batch> getWeekendBatchesByCourseId(Integer courseId);

    @Query("SELECT max(b.batchNumber)+1 from Batch b where b.courseID.id=?1")
    Integer getNextBatchNumberByCourseId(Integer courseID);

    @Query("SELECT left(b.batchCode,4) as batchCodeYear FROM Batch b where b.courseID.id=?1 ORDER BY b.id DESC limit 1")
    Integer getLastBatchCodeYearByCourseID(Integer courseID);





}
