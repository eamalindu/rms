window.addEventListener('load',()=>{

    resetSearchBar();
    getAttendanceReport();
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
            exportToExcel(marks,'Attendance Report '+dateSelected,reportColumnFormat);
            // exportTableToExcel('tblDailyIncome','test');
        }
    });
}