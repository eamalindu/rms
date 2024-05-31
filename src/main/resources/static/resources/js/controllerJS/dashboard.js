window.addEventListener('load',()=>{

    //using refreshDashboardWidgets to refresh the dashboard widget values
    refreshDashboardWidgets();
    generateChartRegistrationBreakdown();
});

const refreshDashboardWidgets = ()=>{

    //daily Income calculation start
    const dailyPayments = ajaxGetRequest("/Payment/getDailyIncome");
    let dailyPayment=0;
    dailyPayments.forEach((payment)=>{
        dailyPayment += payment.amount;
    });
    dailyIncomeText.innerText = "Rs. "+dailyPayment.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})
    //daily Income calculation end


    //monthly Income calculation start
    const monthlyPayments = ajaxGetRequest("Payment/getMonthlyTotalPayment");
    let monthlyPayment = 0;
    monthlyPayments.forEach((payment)=>{
        monthlyPayment += payment.amount;
    });
    monthlyIncomeText.innerText = "Rs. "+monthlyPayment.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})
    //monthly Income calculation end

}

const generateChartRegistrationBreakdown = ()=>{
    const courses = ajaxGetRequest("/Course/findall");
    let courseCode = [];
    let registrationCount = [];
    courses.forEach((course)=>{
        courseCode.push(course.code);
        registrationCount.push(ajaxGetRequest("/Registration/getMonthlyRegistrationByCourseID/"+course.id).length)
    });
    console.log(courseCode);
    console.log(registrationCount);

    generateChart(chartRegistrationBreakdown,`${new Date().getFullYear()}-${new Date().toLocaleString('default', { month: 'short' })}`,courseCode,'Registration Count',[{name: 'Courses', data: registrationCount, color: "#553772"}])
}

const findRegistration=()=>{
    registrationNumber =quickPaymentRegistrationNumber.value;
    if(registrationNumber!=='') {

        const registration = ajaxGetRequest("/Registration/getRegistrationByRegistrationNumber/" + registrationNumber);
        if(registration!==''){
            quickPaymentStudentName.innerText = registration.studentID.title +". "+registration.studentID.nameWithInitials;
            quickPaymentBatchCode.innerText = registration.batchID.batchCode;
            if(registration.isFullPayment) {
                quickPaymentPaymentPlan.innerText = 'One Time Payment';
            }
            else{
                quickPaymentPaymentPlan.innerText ='Installment Plan';
            }
            quickPaymentBalanceFee.innerText = "Rs. "+registration.balanceAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
            collapseRegistration.classList.add('show');
        }
        else{
            showCustomModal("No Registration Found for Registration Number <span class='text-steam-green'> "+registrationNumber+"</span>",'error')
        }
    }
    else{
        showCustomModal("Registration Number is Required!",'warning')
    }
}