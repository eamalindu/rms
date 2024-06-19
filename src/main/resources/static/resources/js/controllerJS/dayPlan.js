window.addEventListener("load", () => {

    resetDayPlanForm();
    generateSchedule();
    //validation chosen select (for new Day Plan)
    $("#dayPlanBatch").chosen().change(function () {
        $("#dayPlanBatch_chosen .chosen-single").addClass('select-validated');
    });
});

const resetDayPlanForm = () => {

    newDayPlan = {}
    const loggedInUserEmployee = ajaxGetRequest("/User/getEmployeeByUsername/"+btnProfileName.innerText);
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
        {property: getRegistrationNumber, dataType: 'function'},
        {property: getStudentName, dataType: 'function'},
        {property: getTimeStamp, dataType: 'function'},
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

const getRegistrationNumber = (ob)=>{
    return ob.registrationID.registrationNumber;
}
const getStudentName = (ob)=>{
    return ob.registrationID.studentID.nameWithInitials;
}
const getTimeStamp = (ob)=>{
    return ob.timeStamp.replace('T',' ');
}

const generateSchedule = ()=>{
    const loggedInUserEmployee = ajaxGetRequest("/User/getEmployeeByUsername/"+btnProfileName.innerText);
    const batches = ajaxGetRequest("/Batch/getBatchesConductTodayByLecturer/" + loggedInUserEmployee.id);
    let event = [];
    const currentDate = new Date();
    const currentDayNumber = currentDate.getDay()+1;

    batches.forEach( batch=>{
        console.log(batch.batchHasDayList.length);
        for(let i = 0; i < batch.batchHasDayList.length; i++){
            const day = batch.batchHasDayList[i];
            if(day.dayID.id === currentDayNumber){
                event.push({title:'Batch : '+batch.batchCode+'\xa0\xa0\xa0 Location : '+day.lectureRoomID.name,start:moment(currentDate).format('YYYY-MM-DD')+"T"+day.startTime,end:moment(currentDate).format('YYYY-MM-DD')+"T"+day.endTime});

            }
        }

    })
    console.log(event)

    var calendarEl = document.getElementById('currentSchedule');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'bootstrap5',
        initialView: 'listDay', // Set the initial view to day view
        headerToolbar: {
            left: 'timeGridDay,listDay',
            center: '',
            right: '' // Added listDay to view options
        },
        views: {
            listDay: { buttonText: 'List Day' }, // Custom text for the list day button
            timeGridDay: { buttonText: 'Day' }, // Custom text for the list day button
        },
        allDaySlot: false, // Hide the all-day slot
        slotMinTime: '08:00:00', // Start time of the calendar
        slotMaxTime: '18:00:00', // End time of the calendar
        contentHeight: 'auto', // Adjust height to fit the content
        slotDuration: '01:00:00', // 30 minute interval
        slotLabelInterval: '01:00', // Show time label every hour
        nowIndicator: true,
        slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false }, // Format for time slots
        events: event,
        eventColor: '#13357a',
        eventTimeFormat: { // like '14:30:00'
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },




    });

    calendar.render();


}