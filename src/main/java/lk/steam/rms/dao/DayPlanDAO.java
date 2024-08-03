package lk.steam.rms.dao;

import lk.steam.rms.entity.DayPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DayPlanDAO extends JpaRepository<DayPlan, Integer> {

    @Query(value = "SELECT * from dayplan where addedby =?1",nativeQuery = true)
    List<DayPlan> getLectureLogsForLecturer(String name);

    @Query(value = "select * from dayplan where date(timestamp) = current_date and batch_id=?1 and addedby=?2",nativeQuery = true)
    DayPlan getLectureLogByDateAndBatchAndAddedBy(Integer batchID, String addedBy);
}
