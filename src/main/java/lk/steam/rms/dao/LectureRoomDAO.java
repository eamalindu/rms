package lk.steam.rms.dao;

import lk.steam.rms.entity.LectureRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LectureRoomDAO extends JpaRepository<LectureRoom,Integer> {
}
