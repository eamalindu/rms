package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    @Id
    @Column(name = "id", unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "employeeid", unique = true)
    @NotNull
    private String employeeID;

    @Column(name = "photopath")
    @NotNull
    private String photoPath;

    @Column(name = "fullname")
    @NotNull
    private String fullName;

    @Column(name = "callingname")
    @NotNull
    private String callingName;

    @Column(name = "nic", length = 10,unique = true)
    @NotNull
    private String nic;

    @Column(name = "dob")
    @NotNull
    private LocalDate dob;

    @Column(name = "gender")
    @NotNull
    private String gender;

    @Column(name = "email",unique = true)
    @NotNull
    private String email;

    @Column(name = "mobilenumber",length = 10)
    @NotNull
    private String mobileNumber;

    @Column(name = "landnumber")
    private String landNumber;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "civilstatus")
    @NotNull
    private String civilStatus;

    @Column(name = "highesteducationqualification")
    @NotNull
    private String highestEducationalQualification;

    @Column(name = "note")
    private String note;

    @Column(name = "added_timestamp")
    @NotNull
    private LocalDateTime added_timestamp;


    @ManyToOne
    @JoinColumn(name = "employeestatus_id",referencedColumnName = "id")
    private EmployeeStatus employeeStatusID;

    @ManyToOne
    @JoinColumn(name = "designation_id",referencedColumnName = "id")
    private Designation designationID;
}
