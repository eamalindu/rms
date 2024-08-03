window.addEventListener('load',()=>{
    resetLecturerForm();
    refreshLecturerTable();
});

const resetLecturerForm = () => {}

const refreshLecturerTable = () => {
    const lecturers = ajaxGetRequest("/Lecturer/findall");
    //creating a display property list for the Mark
    displayPropertyListForLecturers = [
        {property: 'lecturerCode', dataType: 'text'},
        {property: 'name', dataType: 'text'},
        {property: getEmployeeNumber, dataType: 'function'},
        {property: getStatus, dataType: 'function'},]
    //using external function fillDataIntoTable to fill the data to the table tblExamMarks according to the displayPropertyListForMark list
    fillDataIntoTable(tblLecturers, lecturers, displayPropertyListForLecturers, rowView, 'offcanvasLecturerSheet');

    //check the length of the marks array
    if (lecturers.length !== 0) {
        //initializing DataTable for the tblExamMarks table
        $('#tblLecturers').DataTable();
    }
}

const getEmployeeNumber = (ob)=>{
  return ajaxGetRequest("/Employee/getEmployeeIDByEmployee/"+ob.employeeID);
}

const getStatus = (ob) => {
    if(ob.status) {
        return '<span class="badge rounded-0" style="background: #3FB618">Active</span>';
    }
    else{
        return '<span class="badge rounded-0" style="background: #ea2f1e">Deleted</span>';
    }
}

const rowView=(ob)=>{

}