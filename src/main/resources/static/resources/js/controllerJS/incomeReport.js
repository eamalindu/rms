window.addEventListener('load',()=>{
    var start = moment();
    var end = moment();

    function cb(start, end) {
        $('#registrationSearchDateRange span').html(start.format('YYYY-MMMM-DD') + ' - ' + end.format('YYYY-MMMM-DD'));
    }

    $('#registrationSearchDateRange').daterangepicker({
        startDate: start,
        endDate: end,
        locale: {
            "format": "YYYY-MM-DD",
        },
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);

    $('#registrationSearchCourse').chosen({width: '220px'});
    $('#registrationSearchBatch').chosen({width: '220px'});
    $('#registrationSearchPaymentMethod').chosen({width: '220px'});
    $('#registrationSearchUser').chosen({width: '220px'});

})