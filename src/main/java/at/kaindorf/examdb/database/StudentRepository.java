package at.kaindorf.examdb.database;

import at.kaindorf.examdb.pojos.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Page<Student> findAllByClassname_ClassIdOrderByLastnameAscFirstname(Long classId, Pageable pageable);
}
