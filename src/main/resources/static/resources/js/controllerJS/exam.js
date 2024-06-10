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

    $('#examCourse').chosen({width: '100%'});
    $('#examBatch').chosen({width: '100%'});
    $('#examLesson').chosen({width: '100%'});
}