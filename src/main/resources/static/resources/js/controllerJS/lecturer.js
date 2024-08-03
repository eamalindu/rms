window.addEventListener('load',()=>{
    resetLecturerForm();
    refreshLecturerTable();

    //validation chosen select (for new batch)
    $("#lecturerEmployee").chosen().change(function () {
        $("#lecturerEmployee_chosen .chosen-single").addClass('select-validated');
    });
});

const resetLecturerForm = () => {

    $("#lecturerEmployee_chosen .chosen-single").removeClass('select-validated');
    $("#lecturerEmployee_chosen .chosen-single").removeClass('select-invalidated');
    lecturerEmployee.classList.remove('is-valid');
    lecturerEmployee.classList.remove('is-invalid');

    frmNewLecturer.reset();
    newLecturer = {};

    //set default option chosen
    setTimeout(function () {
        $('#lecturerEmployee').val('').trigger('chosen:updated');
    }, 0);

    const employee = ajaxGetRequest("Employee/findall");
    fillSelectOptionsWithTwo(lecturerEmployee,' ',employee,'employeeID','callingName');
    $('#lecturerEmployee').chosen({width: "100%"});
}

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