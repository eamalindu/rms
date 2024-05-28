package lk.steam.rms.dao;

import lk.steam.rms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserDAO extends JpaRepository<User,Integer> {

    @Query(value = "SELECT u from User u where u.email=?1")
    User getUserByEmail(String email);

    @Query(value = "SELECT u from User u where u.username=?1")
    User getUserByUsername(String username);

    @Query(value = "SELECT u from User u where u.email=?1 and u.status=true")
    User getUserByEmailAndStatus(String email);
}
