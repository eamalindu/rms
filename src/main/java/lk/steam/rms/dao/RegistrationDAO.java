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
}
