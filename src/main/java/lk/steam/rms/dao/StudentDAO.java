package lk.steam.rms.dao;

import lk.steam.rms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentDAO extends JpaRepository<Student,Integer> {
}
