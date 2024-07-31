window.addEventListener('load', () => {
    resetSearchForm();
    generateTestChart();
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
})

const resetSearchForm = () => {
    var start = moment();
    var end = moment();

    function cb(start, end) {
        $('#registrationSearchDateRange span').html(start.format('YYYY-MMMM-DD') + ' - ' + end.format('YYYY-MMMM-DD'));
    }

    $('#registrationSearchDateRange').daterangepicker({
        startDate: start, endDate: end, locale: {
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

    const [startDate, endDate] = registrationSearchDateRange.value.split(' - ');
    const payments = ajaxGetRequest("/Payment/getPaymentsByStartDateAndEndDate/"+startDate+"/"+endDate);
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