package lk.steam.rms.dao;

import lk.steam.rms.entity.ExamAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ExamAttemptDAO extends JpaRepository<ExamAttempt, Integer> {

    @Query(value = "SELECT ea from ExamAttempt ea where ea.examDate>=current_date()")
    List<ExamAttempt> findActiveExamAttempts();

    @Query(value = "SELECT ea from ExamAttempt ea where ea.examDate=?1 and ea.registrationID.id=?2 and ea.lessonID.id=?3")
    ExamAttempt findExamAttemptByExamDateAndRegistrationID(LocalDate examDate, Integer registrationID, Integer lessonID);
}
