package lk.steam.rms.dao;

import lk.steam.rms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StudentDAO extends JpaRepository<Student,Integer> {

    @Query(value = "SELECT s from Student s where Student.idValue=?1")
    Student getStudentsByIdValue(String idValue);

}
