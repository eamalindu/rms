package lk.steam.rms.dao;



import lk.steam.rms.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoleDAO extends JpaRepository<Role,Integer> {
    @Query("SELECT r from Role r where r.name=?1")
    Role getRoleByName(String designation);

    @Query("SELECT r from Role r where r.name <> 'Admin' ")
    List<Role> getRolesWithoutAdmin();

}
