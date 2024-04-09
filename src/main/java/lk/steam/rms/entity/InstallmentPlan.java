package lk.steam.rms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "installmentplan")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class InstallmentPlan {

    @Id
    private Integer id;


}
