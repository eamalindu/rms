window.addEventListener('load',()=>{
    resetMarkForm();
    refreshMarkTable();

    //validation chosen select (for new batch)
    $("#examMarksBatch").chosen().change(function () {
        $("#examMarksBatch_chosen .chosen-single").addClass('select-validated');
    });
    //validation chosen select (for new batch)
    $("#examMarksRegistration").chosen().change(function () {
        $("#examMarksRegistration_chosen .chosen-single").addClass('select-validated');
    });
    //validation chosen select (for new batch)
    $("#examLesson").chosen().change(function () {
        $("#examLesson_chosen .chosen-single").addClass('select-validated');
    });
})

const resetMarkForm = () => {

    //remove chosen validation
    $("#examLesson_chosen .chosen-single").removeClass('select-validated');
    $("#examLesson_chosen .chosen-single").removeClass('select-invalidated');
    examLesson.classList.remove('is-valid');
    examLesson.classList.remove('is-invalid');
    $("#examMarksRegistration_chosen .chosen-single").removeClass('select-validated');
    $("#examMarksRegistration_chosen .chosen-single").removeClass('select-invalidated');
    examMarksRegistration.classList.remove('is-valid');
    examMarksRegistration.classList.remove('is-invalid');
    $("#examMarksBatch_chosen .chosen-single").removeClass('select-validated');
    $("#examMarksBatch_chosen .chosen-single").removeClass('select-invalidated');
    examMarksBatch.classList.remove('is-valid');
    examMarksBatch.classList.remove('is-invalid');

    frmNewMark.reset();

    newExamMark = {};

    //set default option chosen
    setTimeout(function () {
        $('#examMarksBatch').val('').trigger('chosen:updated');
        $('#examMarksRegistration').val('').trigger('chosen:updated');
        $('#examLesson').val('').trigger('chosen:updated');
    }, 0);

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newExamInputs');
    inputs.forEach(function (input) {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    const batches = ajaxGetRequest("/Batch/findall");
    fillSelectOptions(examMarksBatch,' ',batches,'batchCode');

    //clear innerOptions of the select elements
    examMarksRegistration.innerHTML = '';
    examLesson.innerHTML = '';

    $('#examMarksBatch').chosen({width:'100%'});
    $('#examMarksRegistration').chosen({width:'100%'});
    $('#examLesson').chosen({width:'100%'});

}

const refreshMarkTable = () => {
    //getting current Marks from the database using ajaxGetRequest function and assign the response to the variable batches
    marks = ajaxGetRequest("/Mark/findall");
    //creating a display property list for the Mark
    displayPropertyListForMark = [
        {property: getRegistrationNumber, dataType: 'function'},
        {property: getStudent, dataType: 'function'},
        {property: getBatch, dataType: 'function'},
        {property: getLesson, dataType: 'function'},
        {property: 'mark', dataType: 'text'},
        {property: getStatus, dataType: 'function'},]
    //using external function fillDataIntoTable to fill the data to the table tblExamMarks according to the displayPropertyListForMark list
    fillDataIntoTable(tblExamMarks, marks, displayPropertyListForMark, rowView, 'offcanvasMarkSheet');

    //check the length of the marks array
    if (marks.length !== 0) {
        //initializing DataTable for the tblExamMarks table
        $('#tblExamMarks').DataTable();
    }

}

const getRegistrationNumber =(ob)=>{
    return ob.registrationID.registrationNumber;
}
const getStudent =(ob)=>{
    return ob.registrationID.studentID.nameWithInitials;
}
const getBatch =(ob)=>{
    return ob.batchID.courseID.name + ' (' + ob.batchID.courseID.code + ')<br/><small class="text-muted">' + ob.batchID.batchCode + '</small>';
}
const getLesson =(ob)=>{
    return ob.lessonID.name;
}
const getStatus =(ob)=>{
    if(ob.isVerified) {
        return '<span class="badge rounded-0" style="background: #3FB618">Verified</span>';
    }
    else{
        return '<span class="badge rounded-0" style="background: #ea2f1e">Not-Verified</span>';
    }
}

const rowView = (ob)=>{

}

const getRegistrations = () => {
     selectedBatch = newExamMark.batchID.id;
    registrations = ajaxGetRequest("/Registration/getRegistrations/"+selectedBatch);
    fillSelectOptions(examMarksRegistration,' ',registrations,'registrationNumber',);
    examMarksRegistration.setAttribute('data-placeholder','Please Select a Registration');
    $('#examMarksRegistration').trigger('chosen:updated');

}

const getLessons = () => {
    let lessonList = newExamMark.batchID.courseID.lessonList;
    lessonList.sort((a,b)=>a.id - b.id);
    fillSelectOptionsWithTwo(examLesson,' ',lessonList,'code','name');
    examLesson.setAttribute('data-placeholder','Please Select a Lesson');
    $('#examLesson').trigger('chosen:updated');
}

const newExamMarkSubmit = () => {
    console.log(newExamMark);
    //calling the checkBatchFormErrors function and catching the return value to errors variable
    let errors = checkMarkFormErrors(newExamMark);
    //check the errors variable is null
    //if it's empty that means all the required inputs are filled
    if (errors === '') {
        //get a user confirmation using external customConfirm js
        showCustomConfirm("You are about to add a New Mark<br>Are You Sure?", function (result) {
            if (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                let serviceResponse = ajaxHttpRequest("/Mark", 'POST', newExamMark);
                //check the serviceResponse value is "OK"
                if (serviceResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Batch Successfully Added!", "success");
                    //close the offcanvas sheet
                    offCanvasExamAttemptCloseButton.click();
                    //refresh the table
                    refreshMarkTable();
                    //refresh the form
                    resetMarkForm();
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

const checkMarkFormErrors = (object) => {
    let errors = '';
    if(object.batchID == null){
        errors = errors + 'Batch is Required<br>';
        $("#examMarksBatch_chosen .chosen-single").addClass('select-invalidated');
        examMarksBatch.classList.add('is-invalid');
    }
    if(object.registrationID == null){
        errors = errors + 'Registration is Required<br>';
        $("#examMarksRegistration_chosen .chosen-single").addClass('select-invalidated');
        examMarksRegistration.classList.add('is-invalid');
    }
    if(object.lessonID == null){
        errors = errors + 'Registration is Required<br>';
        $("#examLesson_chosen .chosen-single").addClass('select-invalidated');
        examLesson.classList.add('is-invalid');
    }
    if(object.marks==null){
        errors = errors + 'Marks is Required<br>';
        examMarks.classList.add('is-invalid');
    }

    return errors;
}