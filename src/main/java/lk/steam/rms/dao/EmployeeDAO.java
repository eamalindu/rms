package lk.steam.rms.dao;

import lk.steam.rms.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeDAO extends JpaRepository<Employee,Integer> {
    @Query(value = "select * from employee where id not in (select employee_id from user where employee_id is not null)",nativeQuery = true)
    List<Employee> getEmployeesWithoutUserAccount();

    @Query(value = "SELECT e from Employee e where e.designationID.id=2")
    List<Employee> getActiveCounsellors();

    @Query(value = "SELECT e from Employee e where e.nic=?1")
    Employee getEmployeeByNIC(String nic);

    @Query(value = "SELECT e from Employee e where e.email=?1")
    Employee getEmployeeByEmail(String email);

    @Query(value = "select e from Employee e where e.mobileNumber=?1")
    Employee getEmployeeByMobileNumber(String mobileNumber);

    @Query(value = "select concat('EMP',lpad((substring(max(employeeid),5)+1) ,3 ,0)) from employee",nativeQuery = true)
    String getNextEmployeeID();

    @Query(value = "select e.employeeID from Employee e where e.id=?1")
    String getEmployeeIDByEmployee(Integer id);
}
