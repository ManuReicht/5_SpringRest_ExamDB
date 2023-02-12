package at.kaindorf.examdb.api;

import at.kaindorf.examdb.database.ExamRepository;
import at.kaindorf.examdb.database.StudentRepository;
import at.kaindorf.examdb.database.SubjectRepository;
import at.kaindorf.examdb.data.JsonExam;
import at.kaindorf.examdb.pojos.Exam;
import at.kaindorf.examdb.pojos.Student;
import at.kaindorf.examdb.pojos.Subject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.lang.reflect.Field;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(value = "/exam", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins="*")
public class ExamController {
    private final ExamRepository examRepo;
    private final StudentRepository studentRepo;
    private final SubjectRepository subjectRepo;

    public ExamController(ExamRepository examRepo, StudentRepository studentRepo, SubjectRepository subjectRepo) {
        this.examRepo = examRepo;
        this.studentRepo = studentRepo;
        this.subjectRepo = subjectRepo;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<List<Exam>> getExamsOfStudent(@PathVariable("studentId") Long studentId){
        return ResponseEntity.of(Optional.of(examRepo.findExamsByStudent_StudentIdOrderByDateOfExam(studentId)));
    }
    @PostMapping
    public ResponseEntity<Exam> addExam(@RequestBody JsonExam createExam){
        createExam.setExamId(examRepo.maxExamId() + 1l);
        Student student = studentRepo.findById(createExam.getStudentId()).orElse(null);
        Subject subject = subjectRepo.findById(createExam.getSubjectId()).orElse(null);
        Exam exam = convertJsonExamToExam(createExam);

        examRepo.save(exam);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(exam.getExamId())
                .toUri();

        return ResponseEntity.created(location).build();
    }
    @PatchMapping
    public ResponseEntity<Exam> updateExam(@RequestBody JsonExam patchExam){
        Optional<Exam> optExam = examRepo.findById(patchExam.getExamId());
        Exam patch = convertJsonExamToExam(patchExam);

        if (optExam.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Exam exam = optExam.get();
            for (Field field: Exam.class.getDeclaredFields()) {
                field.setAccessible(true);
                Object value = ReflectionUtils.getField(field, patch);
                if (value != null && !value.toString().trim().isEmpty()) {
                    ReflectionUtils.setField(field, exam, value);
                }
            }
            examRepo.save(exam);
            return ResponseEntity.ok(exam);
        } catch (Exception e) {
            log.error("Error while updating exam: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{examId}")
    public ResponseEntity<Exam> deleteExam(@PathVariable Long examId) {
        Optional<Exam> optExam = examRepo.findById(examId);

        if (optExam.isPresent()) {
            Exam exam = optExam.get();
            examRepo.delete(exam);
            return ResponseEntity.ok(exam);
        }

        return ResponseEntity.notFound().build();
    }

    private Exam convertJsonExamToExam(JsonExam jsonExam) {
        Student student = studentRepo.findById(jsonExam.getStudentId()).orElse(null);
        Subject subject = subjectRepo.findById(jsonExam.getSubjectId()).orElse(null);
        return new Exam(jsonExam.getExamId(), jsonExam.getDateOfExam(), jsonExam.getDuration(), student, subject);
    }
}
