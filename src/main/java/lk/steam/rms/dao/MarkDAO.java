package lk.steam.rms.dao;

import lk.steam.rms.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MarkDAO extends JpaRepository<Mark,Integer> {

    @Query(value = "SELECT * FROM marks WHERE registration_id = ?1 AND lesson_id = ?2",nativeQuery = true)
    Mark getMarkByRegistrationIDAndLessonID(Integer registrationID, Integer lessonID);
}
