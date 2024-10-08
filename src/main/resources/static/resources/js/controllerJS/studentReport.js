window.addEventListener('load',()=>{
    resetSearchBar();
    getStudentReport();

    //report column format and data
    reportColumnFormat = [
        {name: 'Student Number', data: 'studentNumber'},
        {name: 'Student Name', data: 'nameWithInitials'},
        {name: 'Contact Number', data: 'mobileNumber'},
        {name: 'City', data: 'city'},
        {name: 'NIC', data: 'idValue'},
        {name: 'Guardian Name', data: 'guardianName'},
        {name: 'Guardian Contact Number', data: 'guardianContactNumber'},
    ]

    //date range picker
    $('#registrationSearchDateRange').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    });
});


const resetSearchBar = ()=>{
    var start = moment().startOf('month');
    var end = moment().endOf('month');

    function cb(start, end) {
        $('#registrationSearchDateRange span').html(start.format('YYYY-MMMM-DD') + ' - ' + end.format('YYYY-MMMM-DD'));
    }

    $('#registrationSearchDateRange').daterangepicker({
        startDate: start, endDate: end,
        locale: {
            "format": "YYYY-MM-DD",
        }, ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
        }
    }, cb);

    cb(start, end);
}

const getStudentReport = ()=>{
    //get startDate and endDate from input
    [startDate, endDate] = registrationSearchDateRange.value.split(' - ');
    //using ajaxGetRequest get student records for the selected dates
    students = ajaxGetRequest("/Student/getStudentByStartDateAndEndDate/"+startDate+"/"+endDate);

    currentStartDate.innerText = startDate;
    currentEndDate.innerText = endDate;

    const displayPropertyListForStudent = [
        {property:'studentNumber',dataType: 'text'},
        {property:getStudentName,dataType: 'function'},
        {property:'mobileNumber',dataType: 'text'},
        {property:'city',dataType: 'text'},
        {property:'idValue',dataType: 'text'},
        {property:'guardianName',dataType: 'text'},
        {property:'guardianContactNumber',dataType: 'text'},
    ]
    fillDataIntoTableWithOutAction(tblStudentReport,students,displayPropertyListForStudent)

}

const getStudentName = (ob)=>{
    return ob.title+" "+ob.nameWithInitials;
}

const studentReportToXlsx = ()=>{
    showCustomConfirm('You are about to export <span class="text-steam-green">Student Report</span> data to an Excel spreadsheet<br><br>Are You Sure?',function (result){
        if(result){
            exportToExcel(students,'Student Report '+startDate+' to '+endDate,reportColumnFormat);
            // exportTableToExcel('tblDailyIncome','test');
        }
    });
}