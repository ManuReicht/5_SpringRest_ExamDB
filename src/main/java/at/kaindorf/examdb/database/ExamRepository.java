package at.kaindorf.examdb.database;

import at.kaindorf.examdb.pojos.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Long> {
}
