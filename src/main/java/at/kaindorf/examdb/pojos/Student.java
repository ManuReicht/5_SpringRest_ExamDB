package at.kaindorf.examdb.pojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Student {
    @Id
    @Column(name = "student_id")
    private Long studentId;
    @Column(length = 80)
    private String firstname;
    @Column(length = 80)
    private String lastname;
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "classname", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private Classname classname;
    @OneToMany(mappedBy = "student")
    private List<Exam> exams = new ArrayList<>();
}
