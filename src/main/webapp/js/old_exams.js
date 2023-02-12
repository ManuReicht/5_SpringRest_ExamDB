// global variables
let totalStudents = 0
let studentsList = []
let isInit = false
let currentPage = 1
let totalButtons = 0
let currentClass = 0;
let currentStudent = 0

function init() {
    getAllClassnames()
}

function getAllClassnames() {
    fetch("./classname/all")
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status)
                return
            }
            response.json().then(function (data) {
                console.log("Classes: " + data)
                let list = document.getElementById("allClassnames")
                list.innerHTML = ""
                data.forEach(d => list.innerHTML += `<option value="${d.classId}">${d.classname}</option>`)
            })
        })
        .catch(function (err) {
            console.log('Fetch Error :-S', err)
        })
}

function loadStudentsOfClass() {
    console.log("isInit: " + isInit)
    currentClass = document.getElementById("allClassnames").value
    getStudentCountOfClass()
    initButtons()
    currentPage = 1
    switchPage()
}

function getStudentCountOfClass() {
    fetch("./student/class/" + currentClass + "/count")
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status)
                return
            }
            response.json().then(function (data) {
                console.log("studentCount: " + data)
                totalStudents = data
            })
        })
        .catch(function (err) {
            console.log('Fetch Error :-S', err)
        })
}

function initButtons() {
    //init Buttons
    let ulPageButtons = document.getElementById("pageButtons")
    ulPageButtons.innerHTML = `<li class="page-item"><a class="page-link" href="#" onclick="switchPage(-1)">Previous</a></li>`
    //<li class="page-item"><a class="page-link" href="#" onclick="switchPage(1)">1</a></li>`;
    totalButtons = 0
    for (let i = 0; i < totalStudents; i++) {
        if (i % 10 === 9) {
            ulPageButtons.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="switchPage(${++totalButtons})">${totalButtons}</a></li>`
        }
        ulPageButtons.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="switchPage(-2)">Next</a></li>`
    }
}
function switchPage(pageNo) {
    //-1 = prev
    if (pageNo === -1) {
        if (currentPage === 1) {
            return
        }
        currentPage--
    }
    //-2 = next
    else if (pageNo === -2) {
        if (currentPage === totalButtons) {
            return
        }
        currentPage++
    } else {
        currentPage = pageNo
    }

    let table = document.getElementById("tblStudentsOfClass")
    table.innerHTML = `<thead
            <tr>
                <th>StudentId</th>
                <th>Firstname</th>
                <th>Lastname</th>
            </tr>
        </thead>
        <tbody>`
    loadStudentPage(currentPage)
    studentsList.forEach(s => table.innerHTML += `<tr>
            <td>${s.studentId}</td>
            <td>${s.firstname}</td>
            <td>${s.lastname}</td>
            <td><button type="button" class="btn btn-primary" onclick="getExamsOfStudents(${s.studentId})">Get Exams</button></td>
        </tr>`)
    table.innerHTML += `</tbody>`
}
function loadStudentPage(pageNo){
    fetch("./student/class/" + currentClass + "/all?pageNo=" + (pageNo-1))
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status)
                return
            }
            response.json().then(function (data) {
                console.log("Students: " + data)
                studentsList = data
            })
        })
}

function getExamsOfStudents(studentId) {
    currentStudent = studentId;
    //let ulExams = document.getElementById("ulExams");
    fetch("./exam/of/" + studentId)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (data) {
                console.log("Exams of Student: " + data);
                let tblExams = document.getElementById("tblExamsOfStudent");
                tblExams.innerHTML = `<thead>
                        <tr>
                            <th>ExamId</th>
                            <th>Subject</th>
                            <th>Date of Exam</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>`;
                data.forEach(d => tblExams.innerHTML += `<tr>
                        <td>${d.examId}</td>
                        <td>${d.subject.longname}</td>
                        <td>${d.dateOfExam}</td>
                        <td>${d.duration}</td>
                        </tr>`);
                tblExams += `<tr>
                        <td>Generated</td>
                        <td>${d.subject.longname}</td>
                        <td>${d.dateOfExam}</td>
                        <td>${d.duration}</td>
                        </tr>`;
                tblExams.innerHTML += `</tbody>`;
            });
        }).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
}

function loadAllSubjects() {
    let subjectList;
    fetch("./subject/all")
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (data) {
                console.log("Subjects: " + data);
                subjectList = data;
            });
        }).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
    return subjectList;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
init();
