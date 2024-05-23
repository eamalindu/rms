package lk.steam.rms.dao;


import lk.steam.rms.entity.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrivilegeDAO extends JpaRepository<Privilege,Integer> {
}
