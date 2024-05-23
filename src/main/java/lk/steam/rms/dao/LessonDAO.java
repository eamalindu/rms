package lk.steam.rms.dao;

import lk.steam.rms.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LessonDAO extends JpaRepository<Lesson,Integer> {

    @Query(value = "SELECT l from Lesson l where l.code=?1")
    Lesson getLessonByCode(String lessonCode);
}
