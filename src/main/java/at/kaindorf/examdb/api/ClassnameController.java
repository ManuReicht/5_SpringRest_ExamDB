package at.kaindorf.examdb.api;

import at.kaindorf.examdb.database.ClassnameRepository;
import at.kaindorf.examdb.database.StudentRepository;
import at.kaindorf.examdb.pojos.Classname;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(value = "/classname", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins="*")
public class ClassnameController {
    @Autowired
    private ClassnameRepository classnameRepo;
    @Autowired
    private StudentRepository studentRepo;

    @GetMapping("/all")
    public ResponseEntity<List<Classname>> getAllClassnames(){
        return ResponseEntity.of(Optional.of(classnameRepo.findAll()));
    }
}

