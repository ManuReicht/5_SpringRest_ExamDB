package at.kaindorf.examdb.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping(value = "/exam", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins="*")
public class ExamController {
}
