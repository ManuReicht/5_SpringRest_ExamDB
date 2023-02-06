package at.kaindorf.examdb.api;

import at.kaindorf.examdb.database.ExamRepository;
import at.kaindorf.examdb.database.StudentRepository;
import at.kaindorf.examdb.pojos.Exam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(value = "/exam", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins="*")
public class ExamController {
    @Autowired
    private StudentRepository studentRepo;
    @Autowired
    private ExamRepository examRepo;

    @GetMapping("/of/{studentid}")
    public ResponseEntity<List<Exam>> getExamsOfStudent(@PathVariable("studentid") int studentid){
        Long studentId = Long.valueOf(studentid);
        return ResponseEntity.of(Optional.of(examRepo.findExamsByStudent(studentRepo.findById(studentId).get())));
    }
}
