package lk.steam.rms.dao;

import lk.steam.rms.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleDAO extends JpaRepository<Module,Integer> {
}
