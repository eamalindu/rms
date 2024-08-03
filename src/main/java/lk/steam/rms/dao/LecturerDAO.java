package lk.steam.rms.dao;

import lk.steam.rms.entity.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LecturerDAO extends JpaRepository<Lecturer,Integer> {

    @Query("Select l from Lecturer l where l.status = true")
    List<Lecturer> getActiveLecturers();

    @Query(value = "SELECT concat('L',lpad((substring(max(lecturenumber),3)+1) ,4 ,0)) FROM lecturer",nativeQuery = true)
    String getNextLecturerNumber();

    @Query("Select l from Lecturer l where l.employeeID = ?1")
    Lecturer getLecturerByEmployeeID(Integer employeeID);
}
