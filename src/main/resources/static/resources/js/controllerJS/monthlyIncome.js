window.addEventListener('load',()=>{

    refreshMonthlyBreakDownTable();
    refreshMonthlyCashBreakdownTable();
    generateMonthlyBreakDownLineChart();

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

    var date = new Date();
    startDate = new Date(date.getFullYear(), date.getMonth(), 2).toISOString().split('T')[0];
    endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().split('T')[0];

    currentStartDate.innerHTML = startDate;
    currentEndDate.innerHTML = endDate;
})

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

const monthlyIncomeToXlsx = ()=>{

    showCustomConfirm('You are about to export <span class="text-steam-green">Monthly Income Breakdown</span> data to an Excel spreadsheet<br><br>Are You Sure?',function (result){
        if(result){
            exportToExcel(monthlyPayments,'Monthly Income Report '+startDate+' to '+endDate,reportColumnFormat);
            // exportTableToExcel('tblDailyIncome','test');
        }
    });


}

const monthlyCashToXlsx = ()=>{

    showCustomConfirm('You are about to export <span class="text-steam-green">Monthly Cash Income</span> data to an Excel spreadsheet<br><br>Are You Sure?',function (result){
        if(result){
            exportToExcel(monthlyCashPayments,'Monthly Cash Income Report '+startDate+' to '+endDate,reportColumnFormat);
            // exportTableToExcel('tblDailyIncome','test');
        }
    });


}

const refreshMonthlyBreakDownTable = ()=>{


    //daily Income calculation start
  monthlyPayments = ajaxGetRequest("/Payment/getMonthlyTotalPayment");
    let monthlyPayment=0;
    monthlyPayments.forEach((payment)=>{
        monthlyPayment += payment.amount;
    });
    fullAmountText.innerHTML = "Rs. "+monthlyPayment.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
    //daily Income calculation end

    const displayPropertyListForDailyIncome = [
        {property: 'addedBy', dataType: 'text'},
        {property: getPaymentMethod, dataType: 'function'},
        {property: getTimeStamp, dataType: 'function'},
        {property: getRegistration, dataType: 'function'},
        {property: getStudentName, dataType: 'function'},
        {property: getBatch, dataType: 'function'},
        {property: 'invoiceCode', dataType: 'text'},
        {property: getAmount, dataType: 'function'},
    ];

    fillDataIntoTableWithOutAction(tblMonthlyIncome,monthlyPayments,displayPropertyListForDailyIncome);

    if(monthlyPayments.length!==0){
        $('#tblMonthlyIncome').dataTable();
    }



    // const trFinalAmount = document.createElement('tr');
    // trFinalAmount.innerHTML =`<td class="text-end" colspan="8">Total</td><td class="fw-bold">Rs. ${monthlyPayment.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>`;
    // var tbody = tblMonthlyIncome.children[1];
    // tbody.appendChild(trFinalAmount);
}

const refreshMonthlyCashBreakdownTable = ()=>{


    //daily Income calculation start
    monthlyCashPayments = ajaxGetRequest("/Payment/getMonthlyTotalCashPayment");
    let monthlyCashPayment=0;
    monthlyCashPayments.forEach((payment)=>{
        monthlyCashPayment += payment.amount;
    });
    cashAmountText.innerHTML = "Rs. "+monthlyCashPayment.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});

    //daily Income calculation end

    const displayPropertyListForCashIncome = [
        {property: 'addedBy', dataType: 'text'},
        {property: getPaymentMethod, dataType: 'function'},
        {property: getTimeStamp, dataType: 'function'},
        {property: getRegistration, dataType: 'function'},
        {property: getStudentName, dataType: 'function'},
        {property: getBatch, dataType: 'function'},
        {property: 'invoiceCode', dataType: 'text'},
        {property: getAmount, dataType: 'function'},
    ];

    fillDataIntoTableWithOutAction(tblCashIncome,monthlyCashPayments,displayPropertyListForCashIncome);

    if(monthlyCashPayments.length!==0) {
        $('#tblCashIncome').dataTable();
    }

    // const trFinalAmount = document.createElement('tr');
    // trFinalAmount.innerHTML =`<td class="text-end" colspan="8">Total</td><td class="fw-bold">Rs. ${monthlyCashPayment.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>`;
    // var tbody = tblCashIncome.children[1];
    // tbody.appendChild(trFinalAmount);

}

const generateMonthlyBreakDownLineChart = ()=>{
    console.log("Start Date is"+startDate);
    console.log("End Date is"+endDate);
}