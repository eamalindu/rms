window.addEventListener('load',()=>{
    resetSearchForm();
    getDueReport();

    reportColumnFormat = [
        {name: 'Registration Number', data: 'registrationNumber'},
        {name: 'Student Name', data: 'studentID.nameWithInitials'},
        {name: 'Batch Code', data: 'batchID.batchCode'},
        {name: 'Due Amount (Rs.)', data: 'dueAmount'},
        {name: 'Contact Number', data: 'studentID.mobileNumber'},
    ]

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

const getDueReport = ()=>{
    //monthly due calculation start
    [startDate, endDate] = registrationSearchDateRange.value.split(' - ');
    //set date data
    currentStartDate.innerText = startDate;
    currentEndDate.innerText = endDate;
    //get the due payments from the one time payment registrations from the database using ajaxGetRequest function and store it in fullPaymentDue variable
    const fullPaymentDue = ajaxGetRequest("/Registration/getMonthlyDueRegistration/"+startDate+"/"+endDate)
    //create a variable to store the total monthly due and set the initial value to 0
    let balanceAmount = 0
    registrations = []
    //use forEach function to loop through the fullPaymentDue array and add the balanceAmount to balanceAmount variable
    fullPaymentDue.forEach((registration)=>{
        balanceAmount += registration.balanceAmount;
        registration.dueAmount = registration.balanceAmount;
        registrations.push(registration);
    })
    //get the due payments from the part payment registrations from the database using ajaxGetRequest function and store it in partPaymentDue variable
    const partPaymentDue = ajaxGetRequest("/InstallmentPlan/getMonthlyDueRegistration/"+startDate+"/"+endDate)
    //use forEach function to loop through the partPaymentDue array and add the balanceAmount to balanceAmount variable
    partPaymentDue.forEach((installment=>{
        balanceAmount += installment.balanceAmount;
        installment.registrationID.dueAmount = installment.balanceAmount
        registrations.push(installment.registrationID);
    }))
    //display the balanceAmount value in the monthlyDueText element
    fullAmountText.innerText = "Rs. "+balanceAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})
    //monthly due calculation end

    //registration from installmentObject
    console.log(registrations)

    const displayPropertyListForDue = [
        {property:'registrationNumber',dataType: 'text'},
        {property:getStudentName,dataType: 'function'},
        {property:getBatch,dataType: 'function'},
        {property:getContactNumber,dataType: 'function'},
        {property:getDueAmount,dataType: 'function'}
    ]

    fillDataIntoTableWithOutAction(tblDueReport, registrations,displayPropertyListForDue)
}

const getStudentName = (ob)=>{
    return ob.studentID.title+" "+ob.studentID.nameWithInitials;
}

const getBatch = (ob)=>{
    return ob.batchID.batchCode;
}

const getDueAmount = (ob)=>{
    return "Rs. "+ob.dueAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})
}

const getContactNumber = (ob)=>{
    return ob.studentID.mobileNumber;
}

const dueReportToXlsx = ()=>{
    showCustomConfirm('You are about to export <span class="text-steam-green">Due Report</span> data to an Excel spreadsheet<br><br>Are You Sure?',function (result){
        if(result){
            exportToExcel(registrations,'Due Report '+startDate+' to '+endDate,reportColumnFormat);
            // exportTableToExcel('tblDailyIncome','test');
        }
    });
}