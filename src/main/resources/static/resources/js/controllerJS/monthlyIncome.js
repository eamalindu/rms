window.addEventListener('load',()=>{

    refreshMonthlyBreakDownTable();
    refreshDailyCashBreakdownTable();

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

    // Get the current date
    var currentDate = new Date();
    // Get the start date of the current month
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    startDate = startDate.toISOString().slice(0, 10);


    // Get the end date of the current month
    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    endDate = endDate.toISOString().slice(0, 10);


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

const dailyCashToXlsx = ()=>{

    showCustomConfirm('You are about to export <span class="text-steam-green">Daily Cash Income</span> data to an Excel spreadsheet<br><br>Are You Sure?',function (result){
        if(result){
            exportToExcel(dailyCashPayments,'Daily Cash Income Report '+reportCreatedDate,reportColumnFormat);
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

    const trFinalAmount = document.createElement('tr');
    trFinalAmount.innerHTML =`<td class="text-end" colspan="8">Total</td><td class="fw-bold">Rs. ${monthlyPayment.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>`;
    var tbody = tblMonthlyIncome.children[1];
    tbody.appendChild(trFinalAmount);
}

const refreshDailyCashBreakdownTable = ()=>{


    //daily Income calculation start
    dailyCashPayments = ajaxGetRequest("/Payment/getDailyTotalCashPayment");
    let dailyCashPayment=0;
    dailyCashPayments.forEach((payment)=>{
        dailyCashPayment += payment.amount;
    });
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

    fillDataIntoTableWithOutAction(tblCashIncome,dailyCashPayments,displayPropertyListForCashIncome);

    const trFinalAmount = document.createElement('tr');
    trFinalAmount.innerHTML =`<td class="text-end" colspan="8">Total</td><td class="fw-bold">Rs. ${dailyCashPayment.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>`;
    var tbody = tblCashIncome.children[1];
    tbody.appendChild(trFinalAmount);

}