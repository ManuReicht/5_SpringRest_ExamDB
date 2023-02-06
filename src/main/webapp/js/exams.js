// global variables
let totalStudents = 0;
let studentsList = [];
let isInit = true;
let currentPage = 1;
let totalButtons = 1;
function init() {
    isInit = true;
    getAllClassnames();
    getStudentsOfClassFirstPage();
}

function getAllClassnames() {
    fetch("./classname/all")
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (data) {
                console.log("Classes: "+data);
                let list = document.getElementById("allClassnames");
                list.innerHTML = "";
                data.forEach(d => list.innerHTML += `<option value="${d.classId}">${d.classname}</option>`);
            });
        }).then(function (){
        getStudentsOfClassFirstPage();
    })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function getStudentsOfClassFirstPage() {
    let classid;
    console.log("isInit: " + isInit);
    isInit ? classid = 1 : classid = document.getElementById("allClassnames").value;
    isInit = false;
    console.log("studentsClassid:" + classid);

    //get data
    fetch("./student/class/" + classid + "/all")
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (data) {
                console.log("studentsList: "+data);
                studentsList = data;
            });
            return initButtons();
        }).then(function (){
            initButtons();
    })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
    return "finished";
}
async function initButtons(){
    //init Buttons
    let ulPageButtons = document.getElementById("pageButtons");
    ulPageButtons.innerHTML =
        `<li class="page-item"><a class="page-link" href="#" onclick="switchPage(-1)">Previous</a></li>
            <li class="page-item"><a class="page-link" href="#" onclick="switchPage(1)">1</a></li>`;
    totalButtons = 1;
    for (let i = 0; i < studentsList.length; i++) {
        if (i % 10 === 9) {
            ulPageButtons.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="switchPage(${++totalButtons})">${totalButtons}</a></li>`;
        }
    }
    ulPageButtons.innerHTML +=
        `<li class="page-item"><a class="page-link" href="#" onclick="switchPage(-2)">Next</a></li>`;
    currentPage = 1;
    switchPage(currentPage);
    return "finished;"
}

function switchPage(pageNo) {
    //-1 = prev
    if (pageNo === -1) {
        if (currentPage === 1) {
            return;
        }
        currentPage--;
    }
    //-2 = next
    else if (pageNo === -2) {
        if (currentPage === totalButtons) {
            return;
        }
        currentPage++;
    }else{
        currentPage = pageNo;
    }

    let table = document.getElementById("tblStudentsOfClass");
    table.innerHTML =
        `<thead
            <tr>
                <th>StudentId</th>
                <th>Firstname</th>
                <th>Lastname</th>
            </tr>
        </thead>
        <tbody>`;
    let start = currentPage == 1 ? 0 : (currentPage-1)*10;
    let end = currentPage*10;
    let filteredList = studentsList.slice(start, end);
    filteredList.forEach(s => table.innerHTML +=
        `<tr>
            <td>${s.studentId}</td>
            <td>${s.firstname}</td>
            <td>${s.lastname}</td>
            <td><button type="button" class="btn btn-primary" onclick="getExamsOfStudents(${s.studentId})">Get Exams</button></td>
        </tr>`);
    table.innerHTML += `</tbody>`;
}

function getExamsOfStudents(studentId){
    //let ulExams = document.getElementById("ulExams");
    fetch("./exam/of/"+studentId)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (data) {
                console.log("Exams of Student: "+ data);
                let tblExams = document.getElementById("tblExamsOfStudent");
                tblExams.innerHTML =
                    `<thead>
                        <tr>
                            <th>ExamId</th>
                            <th>Subject</th>
                            <th>Date of Exam</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>`;
                data.forEach(d => tblExams.innerHTML +=
                    `<tr>
                        <td>${d.examId}</td>
                        <td>${d.subject.longname}</td>
                        <td>${d.dateOfExam}</td>
                        <td>${d.duration}</td>
                        </tr>`);
                tblExams.innerHTML +=
                    `</tbody>`;
            });
        }).catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}
