package lk.steam.rms.dao;

import lk.steam.rms.entity.BatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchStatusDAO extends JpaRepository<BatchStatus,Integer> {
}
