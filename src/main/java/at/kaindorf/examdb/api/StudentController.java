package at.kaindorf.examdb.api;

import at.kaindorf.examdb.database.StudentRepository;
import at.kaindorf.examdb.pojos.Student;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(value = "/student", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins="*")
public class StudentController {
    private final StudentRepository studentRepo;

    public StudentController(StudentRepository studentRepo) {
        this.studentRepo = studentRepo;
    }

    @GetMapping("/{classId}")
    public ResponseEntity<Iterable<Student>> getAllStudentsOfClassPaginated(
            @PathVariable("classId") Long classId,
            @RequestParam(name="pageNo", defaultValue = "0") int pageNo) {
        Pageable page = PageRequest.of(pageNo, 10);
        return ResponseEntity.of(Optional.of(studentRepo.findAllByClassname_ClassIdOrderByLastnameAscFirstname(classId, page)));
    }
}
