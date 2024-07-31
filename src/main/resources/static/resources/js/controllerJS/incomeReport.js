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

    const courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(registrationSearchCourse, ' ', courses, 'name')

    const paymentMethods = ajaxGetRequest("/PaymentType/findall")
    fillSelectOptions(registrationSearchPaymentMethod, ' ', paymentMethods, 'name')

    const cashiers = ajaxGetRequest("/Payment/getCashiers")
    fillSelectOptionsWithArray(registrationSearchUser,' ',cashiers)

    $('#registrationSearchCourse').chosen({width: '225px'});
    $('#registrationSearchBatch').chosen({width: '225px'});
    $('#registrationSearchPaymentMethod').chosen({width: '225px'});
    $('#registrationSearchUser').chosen({width: '225px'});
}

const getBatches = () => {

    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/" + JSON.parse(registrationSearchCourse.value).id)
    fillSelectOptions(registrationSearchBatch, ' ', batches, 'batchCode')
    registrationSearchBatch.setAttribute('data-placeholder', 'Sort by a Batch');
    $('#registrationSearchBatch').val('').trigger('chosen:updated');
}

const getIncomeReport = () => {

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