window.addEventListener('load',()=>{

    //using refreshDashboardWidgets to refresh the dashboard widget values
    refreshDashboardWidgets();
    generateChartRegistrationBreakdown();

    resetQuickPaymentForm();

    //validation chosen select (for new batch)
    $("#quickPaymentMethod").chosen().change(function () {
        $("#quickPaymentMethod_chosen .chosen-single").addClass('select-validated');
    });
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

            if (registration.registrationStatusID.name === "Active") {
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #3FB618">Active</span>';
            } else if (registration.registrationStatusID.name === "Suspended") {
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #ea8a1e">Suspended</span>';
            } else if (registration.registrationStatusID.name === "Cancelled") {
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #ea2f1e">Cancelled</span>';
            }
            else if (registration.registrationStatusID.name === "Pending"){
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #616161">Pending</span>';
            }
            else if (registration.registrationStatusID.name === "In Review"){
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #d8b73a">In Review</span>';
            }
            else{
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #000">Deleted</span>';
            }

            newPayment.registrationID = registration;

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

const resetQuickPaymentForm = ()=>{
    //remove collapse show class
    collapseRegistration.classList.remove('show');

    $("#quickPaymentMethod_chosen .chosen-single").removeClass('select-validated');

    newPayment = {}
    frmQuickPayment.reset();

    //set default option chosen
    setTimeout(function () {
        $('#quickPaymentMethod').val('').trigger('chosen:updated');
    }, 0);

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newQuickPaymentInputs');
    inputs.forEach(function (input) {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    const paymentMethods = ajaxGetRequest('/PaymentType/findall');
    fillSelectOptions(quickPaymentMethod,' ',paymentMethods,'name')
    $('#quickPaymentMethod').chosen({width: '100%'});
}