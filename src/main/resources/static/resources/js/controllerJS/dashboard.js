window.addEventListener('load',()=>{

    //using refreshDashboardWidgets to refresh the dashboard widget values
    refreshDashboardWidgets();
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

}