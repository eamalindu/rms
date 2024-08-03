window.addEventListener("load", () => {

    resetDayPlanForm();
    //validation chosen select (for new Day Plan)
    $("#dayPlanBatch").chosen().change(function () {
        $("#dayPlanBatch_chosen .chosen-single").addClass('select-validated');
    });
    $("#sessionLesson").chosen().change(function () {
        $("#sessionLesson_chosen .chosen-single").addClass('select-validated');
    });
    refreshLectureLogTable();
});

const resetDayPlanForm = () => {
    $("#dayPlanBatch_chosen .chosen-single").removeClass('select-validated');
    $("#dayPlanBatch_chosen .chosen-single").removeClass('select-invalidated');
    dayPlanBatch.classList.remove('is-valid');
    dayPlanBatch.classList.remove('is-invalid');

    frmNewLecturerLog.reset();

    newDayPlan = {}
    newDayPlan.dayPlanHasLessonList= [];
    //set default option chosen
    setTimeout(function () {
        $('#dayPlanBatch').val('').trigger('chosen:updated');
    }, 0);

    const loggedInUserEmployee = ajaxGetRequest("/User/getEmployeeByUsername/"+btnProfileName.innerText);
    const batches = ajaxGetRequest("/Batch/getBatchesConductTodayByLecturer/" + loggedInUserEmployee.id);
    fillSelectOptions(dayPlanBatch, ' ', batches, "batchCode");
    $('#dayPlanBatch').chosen({width: '100%'});
    sessionBtn.classList.add('d-none')
    collapseBatch.classList.remove('show')
    //hide timetable table
    tblSession.classList.add('d-none');
    resetInnerForm();
}


const resetInnerForm = ()=>{
    $("#sessionLesson_chosen .chosen-single").removeClass('select-validated');
    $("#sessionLesson_chosen .chosen-single").removeClass('select-invalidated');
    sessionLesson.classList.remove('is-valid');
    sessionLesson.classList.remove('is-invalid');

    frmSession.reset();

    dayPlanHasLesson = {}
    //set default option chosen
    setTimeout(function () {
        $('#sessionLesson').val('').trigger('chosen:updated');
    }, 0);

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newDayPlanHasLessonInputs');
    inputs.forEach(function (input) {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });
    $('#sessionLesson').chosen({width: '100%'});

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

            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();

            requiredHours = hours+(minutes/60);

            collapseBatchDuration.innerText =   hours + "h " + minutes + "m";
            break;
        }
    }
    //get lessons from the selected batch
    let lessonList = selectedBatch.courseID.lessonList;
    //sort lessons
    lessonList.sort((a,b)=>a.id - b.id);
    fillSelectOptions(sessionLesson,' ',lessonList,'name');
    //initialise chosen
    $('#sessionLesson').trigger('chosen:updated');

    //show add session btn
    sessionBtn.classList.remove('d-none')

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


const addToLecturerLog = ()=>{
    let isDuplicate = false;

    // Iterate over each element in the array
    for (let i = 0; i < newDayPlan.dayPlanHasLessonList.length; i++) {
        const existingLog = newDayPlan.dayPlanHasLessonList[i];

        // Compare each property
        if (
            existingLog.lessonID.id === dayPlanHasLesson.lessonID.id &&
            existingLog.startTime === dayPlanHasLesson.startTime &&
            existingLog.endTime === dayPlanHasLesson.endTime
            // Add more properties if needed
        ) {
            // If a match is found, set isDuplicate to true and break out of the loop
            isDuplicate = true;
            break;
        }
    }

    // If it's not a duplicate, add it to the array
    if (!isDuplicate) {
        let errors = checkInnerFormErrors();
        if(errors==='') {

            showCustomConfirm("You are about to add a New Session<br>Are You Sure?", function (result) {
                if(result){
                    newDayPlan.dayPlanHasLessonList.push(dayPlanHasLesson);
                    resetInnerForm()
                }
                else{
                    showCustomModal("Operation Cancelled!", "info");
                }
            })

        }
        else{
            showCustomModal(errors, 'warning');
        }

    } else {
        // Handle duplicate entry
        showCustomModal('Duplicate Session','error');
    }
}

const saveSession = ()=>{
    tblSession.classList.remove('d-none');
    let timeTableBody = tblSession.querySelector('tbody'); // Select the tbody element
    timeTableBody.innerHTML = '';
    let displayPropertyListForTimeTable =[
        {property: getLesson, dataType: 'function'},
        {property: getStartTime, dataType: 'function'},
        {property: getEndTime, dataType: 'function'},
        {property: 'duration', dataType: 'text'},
    ];
    fillDataIntoTableWithDelete(tblSession,newDayPlan.dayPlanHasLessonList,displayPropertyListForTimeTable,removeRecord)
}
const getLesson =(ob)=>{
    return ob.lessonID.code;
}
const getStartTime =(ob)=>{
    return ob.startTime;
}
const getEndTime =(ob)=>{
    return ob.endTime;
}

const removeRecord = (ob)=>{
    let extIndex = newDayPlan.dayPlanHasLessonList.map(item=>item.lessonID.id).indexOf(ob.lessonID.id);
    if(extIndex!=-1){
        newDayPlan.dayPlanHasLessonList.splice(extIndex,1)
        saveSession();
    }
}


const checkInnerFormErrors = ()=>{
    let errors = '';
    if(dayPlanHasLesson.lessonID == null){
        errors += 'Please select a Lesson<br>';
        sessionLesson.classList.add('is-invalid');
        $("#sessionLesson_chosen .chosen-single").addClass('select-invalidated');
    }
    if(dayPlanHasLesson.startTime == null){
        errors += 'Please select a Start Time<br>';
        sessionStartTime.classList.add('is-invalid');
    }
    if(dayPlanHasLesson.endTime == null){
        errors += 'Please select an End Time<br>';
        sessionEndTime.classList.add('is-invalid');
    }
    return errors;
}

const calculateDuration = ()=>{

    let startTime = moment(dayPlanHasLesson.startTime, 'HH:mm');
    let endTime =moment(dayPlanHasLesson.endTime, 'HH:mm');
    let duration = moment.duration(moment(endTime).diff(moment(startTime)));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const minutesInHours = minutes/60;
    sessionDuration.value = hours+minutesInHours;
    dayPlanHasLesson.duration = hours+minutesInHours;
}

const refreshLectureLogTable = ()=>{
    const lectureLogs = ajaxGetRequest("/Lecturer-Log/getLectureLogsForLecturer");
    let displayPropertyList = [
        {property: getBatchCode, dataType: 'function'},
        {property: 'addedBy', dataType: 'text'},
        {property: getAddedTimeStamp, dataType: 'function'},
        {property: getSession, dataType: 'function'},

    ]
    fillDataIntoTableWithOutAction(tblLecturerLog,lectureLogs,displayPropertyList)

}

const getBatchCode = (ob)=>{
    return ob.batchID.batchCode;
}
const getAddedTimeStamp = (ob)=>{
    return ob.timestamp.replace('T',' ');
}
const getSession = (ob)=>{
    let session = '';
    ob.dayPlanHasLessonList.forEach(function (lesson) {
        session += 'Lesson : '+lesson.lessonID.code + ' ['+lesson.startTime+' - '+lesson.endTime+']<br>';
    })
    return session;
}

const newDayPlanSubmit = ()=>{
    let errors = checkDayPlanFormErrors();
    if(errors ===''){
        //get a user confirmation using external customConfirm js
        showCustomConfirm("You are about to add a New Batch<br>Are You Sure?", function (result) {
            if (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                let serverResponse = ajaxHttpRequest("/Lecturer-Log", "POST", newDayPlan);
                //check the serviceResponse value is "OK"
                if (serverResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Lecturer Log Successfully Added!", "success");
                    //close the offcanvas sheet
                    offCanvasDayPlanCloseButton.click();
                    //refresh the table
                    refreshLectureLogTable();
                    //refresh the form
                    resetDayPlanForm();
                } else {
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed!" + serverResponse, "error");
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

const  checkDayPlanFormErrors = ()=>{
    let errors = '';
    if(newDayPlan.dayPlanHasLessonList.length === 0){
        errors += 'Please Add Sessions<br>';
    }
    if(newDayPlan.batchID.id === null){
        errors += 'Please select a Batch<br>';
        dayPlanBatch.classList.add('is-invalid');
        $("#dayPlanBatch_chosen .chosen-single").addClass('select-invalidated');
    }
    //check duration
    let totalDuration = 0;
    newDayPlan.dayPlanHasLessonList.forEach(function (lesson) {
        totalDuration += lesson.duration;
    })
    if(totalDuration !== requiredHours){
        errors += 'Total Duration of Sessions should be '+requiredHours+' Hours<br>';
    }

    return errors;
}