package lk.steam.rms.dao;

import lk.steam.rms.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeDAO extends JpaRepository<Employee,Integer> {
    @Query(value = "select * from employee where id not in (select employee_id from user where employee_id is not null)",nativeQuery = true)
    List<Employee> getEmployeesWithoutUserAccount();
}
