window.addEventListener('load', () => {
    resetSearchBar();
    resetExamAttemptForm();

    $("#examSearchCourse").chosen().change(function () {
        $("#examSearchCourse_chosen .chosen-single").addClass('bg-light');
    });
    $("#examSearchBatch").chosen().change(function () {
        $("#examSearchBatch_chosen .chosen-single").addClass('bg-light');
    });
    $("#examSearchLesson").chosen().change(function () {
        $("#examSearchLesson_chosen .chosen-single").addClass('bg-light');
    });
    $("#examSearchRegistration").chosen().change(function () {
        $("#examSearchRegistration_chosen .chosen-single").addClass('bg-light');
    });
    //validation chosen select (for new exam attempt)
    $("#examCourse").chosen().change(function () {
        $("#examCourse_chosen .chosen-single").addClass('select-validated');
    });
    $("#examBatch").chosen().change(function () {
        $("#examBatch_chosen .chosen-single").addClass('select-validated');
    });
    $("#examLesson").chosen().change(function () {
        $("#examLesson_chosen .chosen-single").addClass('select-validated');
    });
    $("#examRegistration").chosen().change(function () {
        $("#examRegistration_chosen .chosen-single").addClass('select-validated');
    });

    $('#examDate').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        //binding data to newExamAttempt object
        inputTextValidator(this, '^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$', 'newExamAttempt', 'examDate');
    });

})

const resetSearchBar = () => {

    $("#examSearchCourse_chosen .chosen-single").removeClass('bg-light');
    $("#examSearchBatch_chosen .chosen-single").removeClass('bg-light');
    $("#examSearchLesson_chosen .chosen-single").removeClass('bg-light');
    $("#examSearchRegistration_chosen .chosen-single").removeClass('bg-light');

    $('.chosen-registration-search').val('').trigger('chosen:updated');

    //initialize 3rd party daterangepicker library
    //Set the minDate for the batchSheetCommenceDate as the current object's commenceDate value
    $('#examSearchDateRange').daterangepicker({
        "minDate": new Date(),
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": true,
        "drops": "down",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });

    courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(examSearchCourse, ' ', courses, 'name');


    $('#examSearchCourse').chosen({width: '200px'});
    $('#examSearchBatch').chosen({width: '200px'});
    $('#examSearchLesson').chosen({width: '200px'});
    $('#examSearchRegistration').chosen({width: '200px'});
}

const getBatches = () => {
    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/" + JSON.parse(examSearchCourse.value).id)
    fillSelectOptions(examSearchBatch, ' ', batches, 'batchCode')
    $('#examSearchBatch').val('').trigger('chosen:updated');
}

//creating a function to reset the Batch form when ever needed
const resetExamAttemptForm = () => {
    newExamAttempt = {};
    fillSelectOptions(examCourse, ' ', courses, 'name');

    checkBoxValidator(examMode, leftWeekday, rightWeekday, 'newExamAttempt', 'isIndividual', false, true)

    $('#examCourse').chosen({width: '100%'});
    $('#examBatch').chosen({width: '100%'});
    $('#examLesson').chosen({width: '100%'});
    $('#examRegistration').chosen({width: '100%'});
    $('#examDate').daterangepicker({
        "minDate": new Date(),
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": false,
        "drops": "up",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });
    $('#examDate').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        //binding data to newExamAttempt object
        inputTextValidator(this, '^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$', 'newExamAttempt', 'examDate');
    });
}

examMode.addEventListener('change',()=>{
    if(examMode.checked){
        containerExamRegistration.classList.add('d-none');
    }
    else{
        containerExamRegistration.classList.remove('d-none');
    }
})

const getBatch = ()=>{

    currentSelectedCourseID = newExamAttempt.courseID;
    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/"+currentSelectedCourseID.id);
    fillSelectOptions(examBatch,' ',batches,'batchCode');
    examBatch.setAttribute('data-placeholder', 'Select a Batch Now');
    $('#examBatch').val('').trigger('chosen:updated');


}

const getLesson = ()=>{

    const lessons = currentSelectedCourseID.lessonList;
    fillSelectOptions(examLesson,' ',lessons,'name')
    examLesson.setAttribute('data-placeholder', 'Select a Lesson Now');
    $('#examLesson').val('').trigger('chosen:updated');
}

const registration = ()=>{
    currentSelectedBatch = newExamAttempt.batchID;
    const registrations = ajaxGetRequest("/Registration/getRegistrations/"+currentSelectedBatch.id);
    fillSelectOptionsWithTwoNestedObject(examRegistration,' ',registrations,'registrationNumber','studentID','nameWithInitials')
    examRegistration.setAttribute('data-placeholder', 'Select a Registration Now');
    $('#examRegistration').val('').trigger('chosen:updated');
}

const newExamAttemptSubmit = ()=>{
    console.log(newExamAttempt);
    //calling the checkBatchFormErrors function and catching the return value to errors variable
    let errors = checkExamAttemptFormErrors(newExamAttempt);
    //check the errors variable is null
    //if it's null that means all the required inputs are filled
    if (errors === '') {
        let msg = "You are about to add a New Exam Attempt<br>Are You Sure?";
        if(!newExamAttempt.isIndividual){
            msg = "You are about to add New Exam Attempts for the every Student in the Batch <span class='text-steam-green'>"+newExamAttempt.batchID.batchCode+"</span><br>Are You Sure?"
        }
        //get a user confirmation using external customConfirm js
        showCustomConfirm(msg, function (result) {
            if (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                let serviceResponse = ajaxHttpRequest("/Exam", 'POST', newExamAttempt);
                //check the serviceResponse value is "OK"
                if (serviceResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Exam Attempt Successfully Added!", "success");
                    //close the offcanvas sheet
                    offCanvasExamAttemptCloseButton.click();
                    //refresh the table

                    //refresh the form

                }
                else{
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed!" + serviceResponse, "error");
                }

            }
            else{
                showCustomModal("Operation Cancelled!", "info");
            }
        })
    }
    else{
        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');
    }
}

const checkExamAttemptFormErrors = (object)=>{
    let errors = ''

    return errors;

}

const refreshExamTable =()=>{

    const attempts = ajaxGetRequest("/Exam/getActiveExamAttempts");
    const displayPropertyListForExamAttempts = [];
    fillDataIntoTable(tblExamAttempts,attempts,displayPropertyListForExamAttempts,rowView,'');
}