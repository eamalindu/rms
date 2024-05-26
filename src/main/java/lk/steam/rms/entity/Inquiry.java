package lk.steam.rms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inquiry")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Inquiry {

    @Id
    @Column(name = "id",unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "inquirynumber",unique = true)
    @NotNull
    private String inquiryNumber;

    @Column(name = "firstname",length = 20)
    @NotNull
    private String firstName;

    @Column(name = "lastname",length = 30)
    @NotNull
    private String lastName;

    @Column(name = "primarymobilenumber",length = 10)
    @NotNull
    private String primaryMobileNumber;

    @Column(name = "secondarymobilenumber",length = 10)
    private String secondaryMobileNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "idtype",length = 6)
    @NotNull
    private String idType;

    @Column(name = "idvalue",length = 15)
    @NotNull
    private String idValue;

    @Column(name = "contacttime")
    @NotNull
    private LocalDateTime contactTime;

    @Column(name = "description")
    @NotNull
    private String description;

    @Column(name = "addedby",length = 30)
    @NotNull
    private String addedBy;

    @Column(name = "timestamp")
    @NotNull
    private LocalDateTime timeStamp;

    @ManyToOne
    @JoinColumn(name = "source_id",referencedColumnName = "id")
    private Source sourceId;

    @ManyToOne
    @JoinColumn(name = "inquirystatus_id",referencedColumnName = "id")
    private InquiryStatus inquiryStatusId;

    @ManyToOne
    @JoinColumn(name = "course_id",referencedColumnName = "id")
    private Course courseId;

}
