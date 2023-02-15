package at.kaindorf.examdb.api;

import at.kaindorf.examdb.beans.ExamDTO;
import at.kaindorf.examdb.database.ExamRepository;
import at.kaindorf.examdb.database.StudentRepository;
import at.kaindorf.examdb.database.SubjectRepository;
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

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Exam>> getExamsOfStudent(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.of(Optional.of(examRepo.findExamsByStudent_StudentIdOrderByDateOfExam(studentId)));
    }

    @PostMapping("/add")
    public ResponseEntity<Exam> addExam(@RequestBody ExamDTO createExam) {
        createExam.setExamId(examRepo.getMaxExamId() + 1l);
        Student student = studentRepo.findById(createExam.getStudentId()).orElse(null);
        Subject subject = subjectRepo.findById(createExam.getSubjectId()).orElse(null);
        Exam exam = convertDTOToExam(createExam);

        examRepo.save(exam);

        URI location = ServletUriComponentsBuilder.fromCurrentServletMapping()
                .path("/exam/{id}")
                .buildAndExpand(exam.getExamId())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    @PatchMapping("/update")
    public ResponseEntity<Exam> updateExam(@RequestBody ExamDTO patchExam) {
        Optional<Exam> optExam = examRepo.findById(patchExam.getExamId());
        Exam patch = convertDTOToExam(patchExam);

        if (!optExam.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Exam exam = optExam.get();
            for (Field field : Exam.class.getDeclaredFields()) {
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

    @DeleteMapping("/delete/{examId}")
    public ResponseEntity<Exam> deleteExam(@PathVariable Long examId) {
        Optional<Exam> optExam = examRepo.findById(examId);

        if (optExam.isPresent()) {
            Exam exam = optExam.get();
            examRepo.delete(exam);
            return ResponseEntity.ok(exam);
        }

        return ResponseEntity.notFound().build();
    }

    private Exam convertDTOToExam(ExamDTO examDTO) {
        Student student = studentRepo.findById(examDTO.getStudentId() == null ? -1 : examDTO.getStudentId()).orElse(null);
        Subject subject = subjectRepo.findById(examDTO.getSubjectId() == null ? -1 : examDTO.getSubjectId()).orElse(null);
        return new Exam(examDTO.getExamId(), examDTO.getDateOfExam(), examDTO.getDuration(), student, subject);
    }
}
