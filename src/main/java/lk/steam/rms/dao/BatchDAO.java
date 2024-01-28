package lk.steam.rms.dao;

import lk.steam.rms.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchDAO extends JpaRepository<Batch,Integer> {
}
