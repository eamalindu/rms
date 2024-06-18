package lk.steam.rms.dao;

import lk.steam.rms.entity.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LecturerDAO extends JpaRepository<Lecturer,Integer> {

    @Query("Select l from Lecturer l where l.status = true")
    List<Lecturer> getActiveLecturers();

}
