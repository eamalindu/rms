package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "studentnumber")
    @NotNull
    private String studentNumber;

    @Column(name = "title")
    @NotNull
    private String title;

    @Column(name = "fullname")
    @NotNull
    private String fullName;

    @Column(name = "namewithinitails")
    @NotNull
    private String nameWithInitials;

    @Column(name = "gender")
    @NotNull
    private String gender;

    @Column(name = "dob")
    @NotNull
    private LocalDate dob;

    @Column(name = "language")
    @NotNull
    private String language;

    @Column(name = "mobilenumber",unique = true)
    @NotNull
    private String mobileNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "addressline1")
    @NotNull
    private String addressLine1;

    @Column(name = "addressline2")
    private String addressLine2;

    @Column(name = "city")
    @NotNull
    private String city;

    @Column(name = "idtype")
    @NotNull
    private String idType;

    @Column(name = "idvalue")
    @NotNull
    private String idValue;

    @Column(name = "guardianname")
    @NotNull
    private String guardianName;

    @Column(name = "timestamp")
    @NotNull
    private LocalDateTime timeStamp;

    @Column(name = "guardianrelationship")
    @NotNull
    private String guardianRelationship;

    @Column(name = "guardiancontactnumber")
    @NotNull
    private String guardianContactNumber;


}
