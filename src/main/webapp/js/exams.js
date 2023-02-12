function init() {
    loadClassNames()
}

function loadClassNames() {
    const selection = document.getElementById('classNameSelection');

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

function loadStudentsOfClass(classId, pageNo) {
    //document.getElementById('examAction').disabled = true

    fetch('./student/' + classId + '?pageNo=' + pageNo)
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
                    </tr>
                </thead>`
            let tbody = ''
            data.content.forEach(student => {
                tbody +=
                `<tr>
                    <td>${student.studentId}</td>
                    <td>${student.firstname}</td>
                    <td>${student.lastname}</td>
                    <td><button type="button" class="btn btn-primary" onclick="getExamsOfStudents(${student.studentId})">Get Exams</button></td>
                </tr>`
            })
            tblStudents.innerHTML += `<tbody>${tbody}</tbody>`
        })
        .catch(error => console.error(error))
}

function loadExamsForStudent(studentId) {

    const tbody = document.getElementById('tbExam')
    tbody.innerHTML = ''

    console.log('Loading exams for student ' + studentId)

    fetch('./exam/' + studentId)
        .then(response => {
            document.getElementById('examAction').disabled = false
            if (response.status === 204) {
                console.log('No exams found for student ' + studentId)
                alert('No exams found for student ' + studentId)
                return
            }
            response.status === 200 ? response.json().then(data => {
                console.log(data)

                data.forEach(exam => {
                    console.log(exam)
                    const tr = document.createElement('tr')
                    tr.innerHTML = '<td>' + exam.examId + '</td>'
                    tr.innerHTML += '<td>' + exam.subject.longname + '</td>'
                    tr.innerHTML += '<td>' + exam.dateOfExam + '</td>'
                    tr.innerHTML += '<td>' + exam.duration + '</td>'
                    tr.innerHTML += `<td><button onclick="updateExam(${exam.examId}, ${exam.dateOfExam}, ${exam.duration}, ${exam.subject.subjectId})" class="btn btn-info">Edit</button><button onclick="deleteExam(${exam.examId})" class="btn btn-danger">Delete</button></td>`
                    tbody.appendChild(tr)
                })

            }) : console.error('Error while loading exams: ' + response.status + ' ' + response.statusText)
        })
        .catch(error => console.error(error))
}

function deleteExam(examId) {
    fetch('./exam/delete/' + examId, {
        method: 'DELETE'
    })
        .then(response => {
            response.status === 200 ? response.json().then(data => {
                console.log(data)
                loadExamsForStudent(document.querySelector('input[name="student"]:checked').value)
            }) : console.error('Error while deleting exam: ' + response.status + ' ' + response.statusText)
        })
}

function updateExam(examId, dateOfExam, duration, subjectId) {
    document.getElementById('examId').value = examId
    document.getElementById('examDate').valueAsDate = new Date()
    document.getElementById('examDuration').value = duration
    document.getElementById('subjectSelection').value = subjectId
    document.getElementById('examAction').value = 'Update Exam'

    document.getElementById('examAction').onclick = function () {
        const examId = document.getElementById('examId').value
        const studentId = document.querySelector('input[name="student"]:checked').value
        const subjectId = document.getElementById('subjectSelection').value
        const date = document.getElementById('examDate').value
        const duration = document.getElementById('examDuration').value

        if (!(document.getElementById('examId').validity.valid && document.getElementById('examDate').validity.valid && document.getElementById('examDuration').validity.valid)) {
            alert('Please check your input')
            return
        }

        const exam = {
            examId: examId, studentId: studentId, subjectId: subjectId, dateOfExam: date, duration: duration
        }

        document.getElementById('examId').value = ''
        document.getElementById('examDate').value = ''
        document.getElementById('examDuration').value = ''
        document.getElementById('examAction').value = 'Add Exam'
        document.getElementById('examAction').onclick = function () {
            addNewExam()
        }
        loadSubjects()

        fetch('./exam', {
            method: 'PATCH', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(exam)
        }).then(response => {
            response.status === 200 ? response.json().then(data => {
                console.log('Exam updated successfully')
                console.log(data)

                loadExamsForStudent(studentId)

            }) : console.error('Error while updating exam: ' + response.status + ' ' + response.statusText)
        })
    }
}

function loadSubjects() {
    fetch('./subject/all')
        .then(response => {
            response.status === 200 ? response.json().then(data => {
                console.log(data)

                data.forEach(subject => {
                    const option = document.createElement('option')
                    option.text = subject.longname
                    option.value = subject.subjectId
                    document.getElementById('subjectSelection').appendChild(option)
                })
            }) : console.error('Error while loading subjects: ' + response.status + ' ' + response.statusText)
        })
}

function addNewExam() {
    const examId = document.getElementById('examId').value
    const studentId = document.querySelector('input[name="student"]:checked').value
    const subjectId = document.getElementById('subjectSelection').value
    const date = document.getElementById('examDate').value
    const duration = document.getElementById('examDuration').value

    if (!(document.getElementById('examId').validity.valid && document.getElementById('examDate').validity.valid && document.getElementById('examDuration').validity.valid)) {
        alert('Please check your input')
        return
    }

    const exam = {
        examId: examId, studentId: studentId, subjectId: subjectId, dateOfExam: date, duration: duration
    }

    document.getElementById('examId').value = ''
    document.getElementById('examDate').value = ''
    document.getElementById('examDuration').value = ''

    console.log(exam)

    fetch('./exam/add', {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(exam)
    })
        .then(response => {
            if (response.status === 201) {
                console.log(response)
                loadExamsForStudent(studentId)
            } else {
                console.error('Error while adding new exam: ' + response.status + ' ' + response.statusText)
            }
        })
        .catch(error => console.error(error))
}

init()