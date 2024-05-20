package lk.steam.rms.dao;

import lk.steam.rms.entity.Registrations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RegistrationDAO extends JpaRepository<Registrations, Integer> {

    //Get the next registration number form the database
    //This data will be used in RegistrationController
    @Query(value = "SELECT LPAD(MAX(reg.registrationnumber) + 1, 5, 0) AS registrationnumber FROM registration AS reg;",nativeQuery = true)
    String getNextRegistrationNumber();

    //get all the registrations from a specific batch
    @Query(value = "SELECT r from Registrations r where r.batchID.id=?1")
    List<Registrations> getRegistrationsByBatchID(Integer batchID);

    @Query(value = "SELECT r from Registrations r where r.id=?1")
    Registrations getRegistrationsByID(Integer id);

    @Query(value = "SELECT r from Registrations r where r.batchID.id=?1 and r.studentID.id=?2")
    Registrations getRegistrationsByBatchIDAndStudentID(Integer BatchID, Integer StudentID);

    @Query(value = "SELECT r from Registrations  r where r.batchID.id=?1 and r.studentID.idValue=?2")
    Registrations getRegistrationsByBatchIDAndStudentNIC(Integer BatchID, String StudentID);

    @Query(value = "SELECT r from Registrations r where r.registrationNumber=?1")
    Registrations getRegistrationsByRegistrationNumber(String registrationNumber);


    @Query("SELECT r from Registrations r JOIN BatchHasDay bhd on r.batchID.id = bhd.batchID.id JOIN Day d ON bhd.dayID.id = d.id where d.name = DAYNAME(CURDATE()) and r.registrationNumber=?1")
    Registrations getRegistrationHaveClassToday(String registrationNumber);
}
