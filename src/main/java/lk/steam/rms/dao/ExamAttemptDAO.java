package lk.steam.rms.dao;

import lk.steam.rms.entity.ExamAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamAttemptDAO extends JpaRepository<ExamAttempt, Integer> {
}
