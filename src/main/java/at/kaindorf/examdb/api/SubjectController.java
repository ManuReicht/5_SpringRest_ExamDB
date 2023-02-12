package at.kaindorf.examdb.api;

import at.kaindorf.examdb.database.ExamRepository;
import at.kaindorf.examdb.database.StudentRepository;
import at.kaindorf.examdb.database.SubjectRepository;
import at.kaindorf.examdb.pojos.Subject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(value = "/subject", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins="*")
public class SubjectController {
    private final SubjectRepository subjectRepo;

    public SubjectController(SubjectRepository subjectRepo) {
        this.subjectRepo = subjectRepo;
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects(){
        return ResponseEntity.of(Optional.of(subjectRepo.findAll()));
    }
}
