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
        {property: 'marks', dataType: 'text'},
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
    //hide the update btn
    btnMarkSheetUpdate.style.display = 'none';
    //show the deleted btn
    btnMarkSheetDelete.style.display = 'block';
    //show verify btn
    btnMarkSheetVerify.style.display = 'block';
    //show the edit btn
    btnMarkSheetEdit.style.display = 'block';

    //get all the inputs with the class name markSheetInputs and save it as an array
    inputs = document.querySelectorAll('.markSheetInputs');
    //using forEach Function to remove inline styles,boostrap validation classes and set the disabled property to true
    inputs.forEach(function (input) {
        //add the attribute disabled to make inputs block the user input values
        //remove the edited border colors from the inputs
        input.setAttribute('disabled', 'true');
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //set data
    markSheetStudentName.innerText = ob.registrationID.studentID.nameWithInitials;
    markSheetRegistrationNumber.innerText = ob.registrationID.registrationNumber;
    markSheetCourse.innerText = ob.batchID.courseID.name;
    markSheetBatch.innerText = ob.batchID.batchCode;
    markSheetMarks.value = ob.marks;
    examMarkAddedBy.innerText = ob.addedBy;
    examMarkTimeStamp.innerText = ob.timeStamp.replace("T"," ");

    if(ob.isVerified){
        markSheetStatus.innerText = 'Verified';
        btnMarkSheetVerify.style.display = 'none';
        btnMarkSheetEdit.style.display = 'none';
    }
    else{
        markSheetStatus.innerText = 'Not Verified';

    }



    let lessonList = ob.batchID.courseID.lessonList;
    lessonList.sort((a,b)=>a.id - b.id);
    fillSelectOptions(markSheetLesson,'',lessonList,'name',ob.lessonID.id);

    //catching current object to compare them
    editedMark = JSON.parse(JSON.stringify(ob));
    oldMark  = JSON.parse(JSON.stringify(ob));

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
                    showCustomModal("Mark Successfully Added!", "success");
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

//function to validate mark
const markVerification = () => {
    showCustomConfirm("You are about to Verify a Mark<br>Are You Sure?", function (result) {
        if (result) {
            let serviceResponse = ajaxHttpRequest("/Mark/verify", 'PUT', editedMark);
            if (serviceResponse === "OK") {
                showCustomModal("Mark Successfully Verified!", "success");
                offcanvasMarkSheetCloseButton.click();
                refreshMarkTable();
            } else {
                showCustomModal("Operation Failed!" + serviceResponse, "error");
            }
        } else {
            showCustomModal("Operation Cancelled!", "info");
        }
    });
}

const markEdit = ()=>{
    //getting the toast from its ID
    var myToastEl = document.getElementById('myToast');
    var myToast = new bootstrap.Toast(myToastEl);
    //Displaying toast
    myToast.show();
    //hide the toast after 5s
    setTimeout(function () {
        myToast.hide();
    }, 5000);

    //display the update button once the edit button is clicked
    btnMarkSheetUpdate.style.display = 'block';

    //remove the attribute readonly to make inputs accept the user input values
    //give a border color to inputs indicate that the input's values are ready to be edited
    inputs = document.querySelectorAll('.markSheetInputs');

    //remove the disabled attribute from the select
    //give a border color to indicate that select can be now edited

    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
        input.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    });
}