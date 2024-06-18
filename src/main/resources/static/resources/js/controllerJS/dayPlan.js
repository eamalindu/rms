window.addEventListener("load", () => {

    resetDayPlanForm();

    //validation chosen select (for new Day Plan)
    $("#dayPlanBatch").chosen().change(function () {
        $("#dayPlanBatch_chosen .chosen-single").addClass('select-validated');
    });
});

const resetDayPlanForm = () => {

    newDayPlan = {}
    loggedInUserEmployee = ajaxGetRequest("/User/getEmployeeByUsername/"+btnProfileName.innerText);
    const batches = ajaxGetRequest("/Batch/getBatchesConductTodayByLecturer/" + loggedInUserEmployee.id);
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

    const displayPropertyListForAttendance = [
        {},
    ]

    //set information
    collapseBatchAttendance.innerText = attendances.length;

    //set attendance
    fillDataIntoTableWithOutAction(tblAttendance,attendances,displayPropertyListForAttendance)

    //test code
    // Create a new Date object for the current date and time
    const currentDate = new Date();

// Get the current day of the week as a number (0-6) using getDay()
    const currentDayNumber = currentDate.getDay()+1;

    for(let i = 0; i < selectedBatch.batchHasDayList.length; i++){
        const day = selectedBatch.batchHasDayList[i];
        if(day.dayID.id === currentDayNumber){
            console.log(day.dayID.name);
            collapseBatchStartTime.innerText = day.startTime.slice(0,-3);
            collapseBatchEndTime.innerText = day.endTime.slice(0,-3);
            //calculate difference
            const startTime = moment(day.startTime, 'HH:mm');
            const endTime = moment(day.endTime, 'HH:mm');
            const duration = moment.duration(endTime.diff(startTime));
            const adjustedDuration = duration.subtract(30, 'minutes');

            const hours = Math.floor(adjustedDuration.asHours());
            const minutes = adjustedDuration.minutes();

            collapseBatchDuration.innerText =   hours + "h " + minutes + "m";
            break;
        }
    }

}