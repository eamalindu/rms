window.addEventListener('load', () => {
    resetSearchForm();
    generateTestChart();
    getIncomeReport();
    reportColumnFormat = [
        {name: 'Added By', data: 'addedBy'},
        {name: 'Payment Method', data: 'paymentTypeID.name'},
        {name: 'Time Stamp', data: 'timeStamp'},
        {name: 'Registration', data: 'registrationID.registrationNumber'},
        {name: 'Student', data: 'registrationID.studentID.nameWithInitials'},
        {name: 'Course', data: 'registrationID.courseID.name'},
        {name: 'Receipt', data: 'invoiceCode'},
        {name: 'Amount', data: 'amount'},
    ]

    $("#registrationSearchCourse").chosen().change(function () {
        $("#registrationSearchCourse_chosen .chosen-single").addClass('bg-light');
    });
    $("#registrationSearchBatch").chosen().change(function () {
        $("#registrationSearchBatch_chosen .chosen-single").addClass('bg-light');
    });
    $("#registrationSearchPaymentMethod").chosen().change(function () {
        $("#registrationSearchPaymentMethod_chosen .chosen-single").addClass('bg-light');
    });
    $("#registrationSearchUser").chosen().change(function () {
        $("#registrationSearchUser_chosen .chosen-single").addClass('bg-light');
    });
    $('#registrationSearchDateRange').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    });
})

const resetSearchForm = () => {
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

const getIncomeReport = () => {

    [startDate, endDate] = registrationSearchDateRange.value.split(' - ');
     payments = ajaxGetRequest("/Payment/getPaymentsByStartDateAndEndDate/"+startDate+"/"+endDate);
    const displayPropertyListForIncomeReport = [
        {property: 'addedBy', dataType: 'text'},
        {property: getPaymentMethod, dataType: 'function'},
        {property: getTimeStamp, dataType: 'function'},
        {property: getRegistration, dataType: 'function'},
        {property: getStudentName, dataType: 'function'},
        {property: getBatch, dataType: 'function'},
        {property: 'invoiceCode', dataType: 'text'},
        {property: getAmount, dataType: 'function'},
    ];
    fillDataIntoTableWithOutAction(tblIncomeReport,payments,displayPropertyListForIncomeReport);

    //set date
    currentStartDate.innerHTML = startDate;
    currentEndDate.innerHTML = endDate;

    //display total income
    let totalIncome = 0;
    payments.forEach((payment)=>{
        totalIncome += payment.amount;
    });
    fullAmountText.innerHTML = "Rs. "+totalIncome.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});

}

const generateTestChart = ()=>{
    const startDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
    const endDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    const currentMonth = ajaxGetRequest("/Payment/getMonthlyTotalPayment")
    const previousMonth = ajaxGetRequest("/Payment/getPaymentsByStartDateAndEndDate/"+startDate+"/"+endDate)
    monthNames = [moment().startOf('month').format('MMMM'),moment().subtract(1, "month").startOf("month").format('MMMM')]

    let currentMonthTotal = 0;
    currentMonth.forEach((payment)=>{
        currentMonthTotal += payment.amount
    })

    let previousMonthTotal = 0;
    previousMonth.forEach((payment)=>{
        previousMonthTotal += payment.amount
    });

    let chartData = [{name:monthNames[1],data:[previousMonthTotal]},{name:monthNames[0],data:[currentMonthTotal]}]


    generateChart(test,'Income Comparison',monthNames,'Total Income',chartData)
}

const getPaymentMethod = (ob)=>{
    return ob.paymentTypeID.name;
}

const getTimeStamp = (ob)=>{
    return ob.timeStamp.replace('T','&nbsp;&nbsp;');
}

const getRegistration = (ob)=>{
    return ob.registrationID.registrationNumber;
}

const getStudentName = (ob)=>{
    return ob.registrationID.studentID.nameWithInitials;
}

const getBatch = (ob)=>{
    return ob.registrationID.courseID.name;
}

const getAmount = (ob)=>{
    return "Rs. "+ob.amount.toLocaleString('en-US',{maximumFractionDigits: 2,minimumFractionDigits: 2})
}

const incomeReportToXlsx = ()=>{
    showCustomConfirm('You are about to export <span class="text-steam-green">Monthly Income Breakdown</span> data to an Excel spreadsheet<br><br>Are You Sure?',function (result){
        if(result){
            exportToExcel(payments,'Income Report '+startDate+' to '+endDate,reportColumnFormat);
            // exportTableToExcel('tblDailyIncome','test');
        }
    });
}