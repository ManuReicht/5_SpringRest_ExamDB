package at.kaindorf.examdb.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JsonExam {
    private Long examId;
    private Long studentId;
    private Long subjectId;
    private LocalDate dateOfExam;
    private int duration;

    public JsonExam(Long studentId, Long subjectId, LocalDate dateOfExam, int duration) {
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.dateOfExam = dateOfExam;
        this.duration = duration;
    }
}
