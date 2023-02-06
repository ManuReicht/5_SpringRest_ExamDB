package at.kaindorf.examdb.pojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Exam {
    @Id
    @Column(name = "exam_id")
    private Long examId;
    @Column(name = "dateofexam")
    private LocalDate dateOfExam;
    private int duration;
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "student", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private Student student;
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "subject", nullable = false)
    private Subject subject;
}
