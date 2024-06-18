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
    collapseBatch.classList.add('show')

    const selectedBatch = JSON.parse(dayPlanBatch.value);
    const attendances  = ajaxGetRequest("/Attendance/getAttendanceByBatchIDForToday/"+selectedBatch.id)

    //set information
    collapseBatchAttendance.innerText = attendances.length;

    collapseBatchDuration.innerText =   selectedBatch.batchHasDayList;

    //test code
    // Create a new Date object for the current date and time
    const currentDate = new Date();

// Define an array with the full names of the days of the week
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Get the current day of the week as a number (0-6) using getDay()
    const currentDayNumber = currentDate.getDay();

// Use the day number to get the corresponding day name from the array
    const currentDayName = daysOfWeek[currentDayNumber];

    for(let i = 0; i < selectedBatch.batchHasDayList.length; i++){
        const day = selectedBatch.batchHasDayList[i];
        if(day.dayID.name === currentDayName){
            collapseBatchStartTime.innerText = day.startTime.slice(0,-3);
            collapseBatchEndTime.innerText = day.endTime.slice(0,-3);
            break;
        }
    }

}