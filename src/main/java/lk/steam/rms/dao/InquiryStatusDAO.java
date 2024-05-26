package lk.steam.rms.dao;

import lk.steam.rms.entity.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryStatusDAO extends JpaRepository<InquiryStatus,Integer> {
}
