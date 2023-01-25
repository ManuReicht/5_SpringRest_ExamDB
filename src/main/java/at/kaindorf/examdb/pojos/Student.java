package at.kaindorf.examdb.pojos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Student {
    @Id
    private Long studentId;
    @Column(length = 80)
    private String firstname;
    @Column(length = 80)
    private String lastname;
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Classname classname;
    @OneToMany(mappedBy = "student")
    private List<Exam> exams = new ArrayList<>();
}
