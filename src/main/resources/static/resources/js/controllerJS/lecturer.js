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
    lecturerName.classList.remove('is-valid');
    lecturerName.classList.remove('is-invalid');

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

const newLecturerSubmit = ()=>{
    console.log(newLecturer);
    //calling the checkBatchFormErrors function and catching the return value to errors variable
    let errors = checkLecturerFormErrors(newLecturer);
    //check the errors variable is null
    //if it's empty that means all the required inputs are filled
    if (errors === '') {
        //get a user confirmation using external customConfirm js
        showCustomConfirm("You are about to add a New Lecturer<br>Are You Sure?", function (result) {
            if (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                let serviceResponse = ajaxHttpRequest("/Lecturer", 'POST', newLecturer);
                //check the serviceResponse value is "OK"
                if (serviceResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Lecturer Successfully Added!", "success");
                    //close the offcanvas sheet
                    offCanvasLecturerCloseButton.click();
                    //refresh the table
                    refreshLecturerTable();
                    //refresh the form
                    resetLecturerForm();
                } else {
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed!" + serviceResponse, "error");
                }
            }
                //will execute this block if the user confirmation is "no"
            //show user an alert
            else {
                showCustomModal("Operation Cancelled!", "info");
            }
        });
    } else {
        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');

    }
}

const checkLecturerFormErrors = (object)=>{
    let errors ='';
    if(object.employeeID==null){
        errors +='Employee is Required<br>';
        lecturerEmployee.classList.add('is-invalid');
        $("#lecturerEmployee_chosen .chosen-single").addClass('select-invalidated');
    }
    if(object.name===null){
        errors +='Name is Required<br>';
        lecturerName.classList.add('is-invalid');
    }
    return errors;
}

const correctAssign =()=>{
    newLecturer.employeeID = newLecturer.employeeID.id;
}