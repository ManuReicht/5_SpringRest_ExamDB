package at.kaindorf.examdb.api;

import at.kaindorf.examdb.database.ClassnameRepository;
import at.kaindorf.examdb.pojos.Classname;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping(value = "/classname", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins="*")
public class ClassnameController {
    private final ClassnameRepository classnameRepo;
    public ClassnameController(ClassnameRepository classnameRepository) {
        this.classnameRepo = classnameRepository;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Classname>> getAllClassnames() {
        log.debug("REST request to get all Classnames");
        List<Classname> classnames = classnameRepo.findAll(Sort.by("classname"));
        return classnames.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(classnames);
    }
}

