package lk.steam.rms.dao;

import lk.steam.rms.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BatchDAO extends JpaRepository<Batch,Integer> {

    @Query(value = "SELECT b from Batch b where b.courseID.id=?1 and b.isWeekday = true")
    List<Batch> getWeekDayBatchByCourse(Integer courseID);


}
