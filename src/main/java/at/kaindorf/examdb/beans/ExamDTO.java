package at.kaindorf.examdb.beans;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExamDTO {
    private Long examId;
    private Long studentId;
    private Long subjectId;
    private LocalDate dateOfExam;
    private int duration;
}
