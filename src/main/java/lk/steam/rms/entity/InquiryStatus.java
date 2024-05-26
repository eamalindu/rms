package lk.steam.rms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inquirystatus")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InquiryStatus {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name",length = 45)
    private String name;

}
