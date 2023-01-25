package at.kaindorf.examdb.pojos;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Subject {
    @Id
    private Long subjectId;
    private String longname;
    private String shortname;
    private boolean written;
    @OneToMany(mappedBy = "subject")
    private List<Exam> exams = new ArrayList<>();

}
