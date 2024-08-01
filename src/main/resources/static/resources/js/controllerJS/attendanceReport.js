window.addEventListener('load',()=>{

    resetSearchBar();
    getAttendanceReport();

    reportColumnFormat = [
        {name: 'Registration Number', data: 'registrationID.registrationNumber'},
        {name: 'Student', data: 'registrationID.studentID.nameWithInitials'},
        {name: 'Course', data: 'batchID.courseID.name'},
        {name: 'Batch', data: 'batchID.batchCode'},
        {name: 'Lesson', data: 'lessonID.name'},
        {name: 'Lesson Code', data: 'lessonID.code'},
        {name: 'Marks', data: 'marks'},
        {name: 'Verified?', data: 'isVerified'},
        {name: 'Added By', data: 'addedBy'},
        {name: 'Date and Time', data: 'timeStamp'},
    ];
})

const resetSearchBar = () => {
    //initialize 3rd party daterangepicker library
    //Set the minDate for the batchSheetCommenceDate as the current object's commenceDate value
    $('#searchDateRange').daterangepicker({
        "maxDate":new Date(),
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": true,
        "drops": "down",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });
}

const getAttendanceReport = () => {
    dateSelected = searchDateRange.value;
    currentStartDate.innerText = dateSelected;
    attendances = ajaxGetRequest("/Attendance/getAttendanceByDate/"+dateSelected);
    displayPropertyListForAttendance = [
        {property:getBatchCode,dataType:'function'},
        {property:getMarkedDate,dataType:'function'},
        {property:getRegistration,dataType:'function'},
    ];

    fillDataIntoTableWithOutAction(tblAttendanceReport,attendances,displayPropertyListForAttendance);
}

const getBatchCode=(ob)=>{
    return ob.registrationID.batchID.batchCode;
}
const getMarkedDate=(ob)=>{
    return ob.timeStamp.replace("T"," ");
}
const getRegistration=(ob)=>{
    return ob.registrationID.registrationNumber;
}

const attendanceReportToXlsx = ()=>{
    showCustomConfirm('You are about to export <span class="text-steam-green">Attendance Report</span> data to an Excel spreadsheet<br><br>Are You Sure?',function (result){
        if(result){
            exportToExcel(attendances,'Attendance Report '+dateSelected,reportColumnFormat);
            // exportTableToExcel('tblDailyIncome','test');
        }
    });
}