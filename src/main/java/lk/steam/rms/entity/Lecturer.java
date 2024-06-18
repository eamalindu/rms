package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lecturer")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Lecturer {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "lecturenumber")
    @NotNull
    private String lecturerCode;

    @Column(name = "status")
    @NotNull
    private Boolean status;

    @OneToOne
    @JoinColumn(name = "employee_id",referencedColumnName = "id")
    private Employee employeeID;
}
