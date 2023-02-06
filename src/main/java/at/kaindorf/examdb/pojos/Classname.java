package at.kaindorf.examdb.pojos;

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
public class Classname {
    @Id
    @Column(name = "class_id")
    private Long classId;
    @Column(length = 10)
    private String classname;
    @OneToMany(mappedBy = "classname")
    private List<Student> students = new ArrayList<>();
}
