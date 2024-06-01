window.addEventListener('load',()=>{


    //daily Income calculation start
    const dailyPayments = ajaxGetRequest("/Payment/getDailyIncome");
    let dailyPayment=0;
    dailyPayments.forEach((payment)=>{
        dailyPayment += payment.amount;
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

    fillDataIntoTableWithOutAction(tblDailyIncome,dailyPayments,displayPropertyListForDailyIncome);

    const trFinalAmount = document.createElement('tr');
    trFinalAmount.innerHTML =`<td class="text-end" colspan="8">Total</td><td class="fw-bold">Rs. ${dailyPayment.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>`;
    var tbody = document.getElementById("tblDailyIncome").getElementsByTagName('tbody')[0];
    tbody.appendChild(trFinalAmount);
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