package lk.steam.rms.dao;

import lk.steam.rms.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonDAO extends JpaRepository<Lesson,Integer> {
}
