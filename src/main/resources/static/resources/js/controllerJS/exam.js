window.addEventListener('load',()=>{
    resetSearchBar();
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


})

const resetSearchBar=()=>{

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

    const courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(examSearchCourse, ' ', courses, 'name');


    $('#examSearchCourse').chosen({width: '200px'});
    $('#examSearchBatch').chosen({width: '200px'});
    $('#examSearchLesson').chosen({width: '200px'});
    $('#examSearchRegistration').chosen({width: '200px'});
}

const getBatches = ()=>{
    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/" + JSON.parse(examSearchCourse.value).id)
    fillSelectOptions(examSearchBatch, ' ', batches, 'batchCode')
    $('#examSearchBatch').val('').trigger('chosen:updated');
}