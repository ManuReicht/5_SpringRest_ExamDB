package at.kaindorf.examdb.pojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Subject {
    @Id
    @Column(name = "subject_id")
    private Long subjectId;
    @Column(length = 100)
    private String longname;
    @Column(length = 10)
    private String shortname;
    @Column(nullable = false)
    private boolean written;
    @OneToMany(mappedBy = "subject")
    @ToString.Exclude
    @JsonIgnore
    private List<Exam> exams = new ArrayList<>();

}
