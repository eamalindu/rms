package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "privilege")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "selectprivilege")
    @NotNull
    private Boolean selectPrivilege;

    @Column(name = "insertprivilege")
    @NotNull
    private Boolean insertPrivilege;

    @Column(name = "updateprivilege")
    @NotNull
    private Boolean updatePrivilege;

    @Column(name = "deleteprivilege")
    @NotNull
    private Boolean deletePrivilege;

    //foreign keys
    @ManyToOne
    @JoinColumn(name = "role_id",referencedColumnName = "id")
    private Role roleID;

    @ManyToOne
    @JoinColumn(name = "module_id",referencedColumnName = "id")
    private Module moduleID;

}
