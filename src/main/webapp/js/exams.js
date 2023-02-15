let subjects = []
let selectedStudent = 0
function init() {
    loadClassNames()
    loadSubjects()
    disableExamActions(true)
}

function loadClassNames() {
    const selection = document.getElementById('classNameSelection')

    fetch('./classname/all')
        .then(response => {
            response.status === 200 ? response.json().then(data => {
                console.log(data);

                data.forEach(className => {
                    const option = document.createElement('option')
                    option.text = className.classname
                    option.value = className.classId
                    selection.appendChild(option)
                })
            }) : console.error('Error while loading class names: ' + response.status + ' ' + response.statusText)
        })
        .catch(error => console.error(error))
}
function loadSubjects(){
    let selection = document.getElementById('subjectSelection')
    fetch('./subject/all')
        .then(response => {
            response.status === 200 ? response.json().then(data => {
                subjects = data
                data.forEach(subject => {
                    const option = document.createElement('option')
                    option.text = subject.longname
                    option.value = subject.subjectId
                    selection.appendChild(option)
                })
            }) : console.error('Error while loading class names: ' + response.status + ' ' + response.statusText)
        })
        .catch(error => console.error(error))
}

function loadStudentsOfClass(classId, pageNo) {
    disableExamActions(true)
    fetch('./student/class/' + classId + '?pageNo=' + pageNo)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            const studentPagination = document.getElementById('studentPagination')
            studentPagination.innerHTML = ''

            for (let i = 0; i < data.totalPages; i++) {
                const li = document.createElement('li')
                li.classList.add('page-item')
                li.innerHTML = `<a class="page-link" onclick="loadStudentsOfClass(${classId},${i})">${i + 1}</a>`
                studentPagination.appendChild(li)
            }

            const tblStudents = document.getElementById('tblStudentsOfClass')
            tblStudents.innerHTML =
                `<thead
                    <tr>
                        <th>StudentId</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Action</th>
                    </tr>
                </thead>`
            let tbody = ''
            data.content.forEach(student => {
                tbody +=
                `<tr>
                    <td>${student.studentId}</td>
                    <td>${student.firstname}</td>
                    <td>${student.lastname}</td>
                    <td><button type="button" class="btn btn-primary" onclick="loadExamsOfStudent(${student.studentId})">Get Exams</button></td>
                </tr>`
            })
            tblStudents.innerHTML += `<tbody>${tbody}</tbody>`
        })
        .catch(error => console.error(error))
}

function loadExamsOfStudent(studentId) {
    disableExamActions(false)
    selectedStudent = studentId
    fetch("./exam/student/" + studentId)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status)
                return
            }
            response.json().then(function (data) {
                console.log("Exams of Student: " + data)
                let tblExams = document.getElementById("tblExamsOfStudent")
                tblExams.innerHTML = `<thead>
                        <tr>
                            <th>ExamId</th>
                            <th>Subject</th>
                            <th>Date of Exam</th>
                            <th>Duration</th>
                            <th>Action</th>
                        </tr>
                    </thead>`
                let tbody = ''
                data.forEach(exam =>
                    tbody +=
                        `<tr>
                            <td>${exam.examId}</td>
                            <td>${exam.subject.longname}</td>
                            <td>${exam.dateOfExam}</td>
                            <td>${exam.duration}</td>
                            <td>
                                <button type="button" class="btn btn-primary" onclick="initUpdateExam(${exam.examId},\'${exam.dateOfExam}\',${exam.duration},${exam.subject.subjectId})">Update</button>
                                <button type="button" class="btn btn-danger" onclick="removeExam(${exam.examId})">Remove</button>
                            </td>
                        </tr>`)
                tblExams.innerHTML += `<tbody>${tbody}</tbody>`
            });
        }).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
}

function addUpdateExam(){
    let subjectId = document.getElementById('subjectSelection').value
    let dateOfExam = document.getElementById('dateOfExam').value
    let duration = document.getElementById('duration').value

    document.getElementById('examId').value === '' ? addExam(subjectId, dateOfExam, duration) : updateExam(subjectId, dateOfExam, duration)
    clearExamActions()
}

function initUpdateExam(examId, dateOfExam, duration, subjectId) {
    dateOfExam = dateOfExam.trim().replaceAll(' ', '/')
    document.getElementById('examId').value = examId
    document.getElementById('subjectSelection').value = subjectId
    document.getElementById('dateOfExam').valueAsDate = new Date(dateOfExam)
    document.getElementById('duration').value = duration
}
function addExam(subjectId, dateOfExam, duration){
    let exam = {
        studentId: selectedStudent,
        subjectId: subjectId,
        dateOfExam: dateOfExam,
        duration: duration
    }
    fetch('./exam/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exam)
    })
        .then(response => {
            if (response.status === 201) {
                console.log(response);
                loadExamsOfStudent(selectedStudent);
            } else {
                console.error('Error while adding new exam: ' + response.status + ' ' + response.statusText);
            }
        })
        .catch(error => console.error(error));
}

function updateExam(subjectId, dateOfExam, duration){
    let examId = document.getElementById('examId').value
    let exam = {
        examId: examId,
        studentId: selectedStudent,
        subjectId: subjectId,
        dateOfExam: dateOfExam,
        duration: duration
    }
    fetch('./exam/update', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exam)
    }).then(response => {
        response.status === 200 ? response.json().then(data => {
            console.log('Exam updated successfully');
            console.log(data);

            loadExamsOfStudent(selectedStudent);

        }) : console.error('Error while updating exam: ' + response.status + ' ' + response.statusText);
    })
}
function removeExam(examId) {
    fetch('./exam/delete' + examId, {
        method: 'DELETE'
    })
        .then(response => {
            response.status === 200 ? response.json().then(data => {
                console.log(data);
                loadExamsOfStudent(selectedStudent)
            }) : console.error('Error while deleting exam: ' + response.status + ' ' + response.statusText);
        })
}
function disableExamActions(disabled){
    document.getElementById('subjectSelection').disabled = disabled
    document.getElementById('dateOfExam').disabled = disabled
    document.getElementById('duration').disabled = disabled
    document.getElementById('btnExamAction').disabled = disabled
    document.getElementById('examId').value = ''
    document.getElementById('subjectSelection').value = 0
    document.getElementById('dateOfExam').value = ''
    document.getElementById('duration').value = ''
}

function clearExamActions(){
    document.getElementById('examId').value = ''
    document.getElementById('subjectSelection').value = 0
    document.getElementById('dateOfExam').value = ''
    document.getElementById('duration').value = ''
}

init()