// global variables
let totalStudents = 0;
let studentsList = [];
let isInit = true;
function init() {
    isInit = true;
    getAllClassnames();
}

function getAllClassnames() {
    fetch("./classname/all")
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.json().then(function (data) {
                console.log(data);
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
                console.log(data);
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
    let divPageButtons = document.getElementById("pageButtons");
    divPageButtons.innerHTML = "";
    let totalButtons = 1;
    console.log("initButtons");
    for (let i = 0; i < studentsList.length; i++) {
        console.log("before if");
        if (i % 10 === 9) {
            console.log("addButton");
            divPageButtons.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="switchPage(${++totalButtons})">${++totalButtons}</a></li>`;
        }
    }
    return "finished;"
}

function switchPage(pageNo) {
    //-1 = prev
    //-2 = next

}
