package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "designation")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Designation {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "designation")
    @NotNull
    private String designation;

    @Column(name = "useraccountneeded")
    @NotNull
    private Boolean userAccountNeeded;
}
