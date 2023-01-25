package at.kaindorf.examdb.pojos;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Exam {
    @Id
    private Long examId;
    private LocalDate dateOfExam;
    private int duration;
    @ManyToOne
    private Student student;
    @ManyToOne
    private Subject subject;
}
