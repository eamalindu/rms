window.addEventListener('load',()=>{

    resetSearchBar();
    getAttendanceReport();
})

const resetSearchBar = () => {
    //initialize 3rd party daterangepicker library
    //Set the minDate for the batchSheetCommenceDate as the current object's commenceDate value
    $('#searchDateRange').daterangepicker({
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
}