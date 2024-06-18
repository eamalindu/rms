window.addEventListener("load", () => {

    resetDayPlanForm();

    //validation chosen select (for new Day Plan)
    $("#dayPlanBatch").chosen().change(function () {
        $("#dayPlanBatch_chosen .chosen-single").addClass('select-validated');
    });
});

const resetDayPlanForm = () => {

    newDayPlan = {}

    const batches = ajaxGetRequest("/Batch/getBatchesConductTodayByLecturer/" + btnProfileName.innerText);
    fillSelectOptions(dayPlanBatch, ' ', batches, "batchCode");
    $('#dayPlanBatch').chosen({width: '100%'});

    resetInnerForm();
}


const resetInnerForm = ()=>{
    dayPlanHasLesson = {}
}

const getBatchInfo = ()=>{
    const selectedBatch = JSON.parse(dayPlanBatch.value);
    const attendances  = ajaxGetRequest("/Attendance/getAttendanceByBatchIDForToday/"+selectedBatch.id)
}