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
        console.log(registration);
    }
    else{
        showCustomModal("Registration Number is Required!",'warning')
    }
}