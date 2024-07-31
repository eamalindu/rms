package lk.steam.rms.dao;


import lk.steam.rms.entity.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilegeDAO extends JpaRepository<Privilege,Integer> {


    @Query(value = "SELECT bit_or(p.insertprivilege) as customSelect, bit_or(p.insertprivilege) as customInsert,bit_or(p.updateprivilege) as customUpdate,bit_or(p.deleteprivilege) as customDelete from privilege as p where p.module_id in (select m.id from module as m where m.name=?2) and p.role_id in(select uhr.role_id from user_has_role as uhr where uhr.user_id in (SELECT u.id from User as u where u.username=?1))",nativeQuery = true)
    String getPrivilegesByUserAndModule(String username, String module);

    @Query(value = "SELECT p from Privilege p where p.roleID.id=?1 and p.moduleID.id=?2")
    Privilege getPrivilegeByRoleAndModule(Integer roleID, Integer moduleID);
}
