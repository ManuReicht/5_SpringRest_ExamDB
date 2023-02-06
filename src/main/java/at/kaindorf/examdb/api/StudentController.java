package at.kaindorf.examdb.api;

import at.kaindorf.examdb.database.ClassnameRepository;
import at.kaindorf.examdb.database.StudentRepository;
import at.kaindorf.examdb.pojos.Student;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(value = "/student", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins="*")
public class StudentController {
    @Autowired
    private ClassnameRepository classnameRepo;
    @Autowired
    private StudentRepository studentRepo;

    @GetMapping("/class/{classid}/count")
    public ResponseEntity<Long> getStudentsCountOfClass(@PathVariable("classid") int classid){
        Long classId = Long.valueOf(classid);
        return ResponseEntity.of(Optional.of(studentRepo.countAllByClassname(classnameRepo.findById(classId).get())));
    }
    @GetMapping("/class/{classid}/all")
    public ResponseEntity<List<Student>> getAllStudents(@PathVariable("classid") int classid) {
        Long classId = Long.valueOf(classid);
        return ResponseEntity.of(Optional.of(studentRepo.findAllByClassname(classnameRepo.findById(classId).get())));
    }

}
