window.addEventListener('load',()=>{

    //using refreshDashboardWidgets to refresh the dashboard widget values
    refreshDashboardWidgets();
    generateChartRegistrationBreakdown();
    generateChartRegistrationCounsellorBreakdown();

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


    //monthly due calculation start
    const startDateCurrentMonth =  moment().startOf('month').format('YYYY-MM-DD');
    const endDateCurrentMonth =  moment().endOf('month').format('YYYY-MM-DD');
    const fullPaymentDue = ajaxGetRequest("/Registration/getMonthlyDueRegistration/"+startDateCurrentMonth+"/"+endDateCurrentMonth)
    let balanceAmount = 0
    fullPaymentDue.forEach((registration)=>{
        balanceAmount += registration.balanceAmount;
    })
    const partPaymentDue = ajaxGetRequest("/InstallmentPlan/getMonthlyDueRegistration/"+startDateCurrentMonth+"/"+endDateCurrentMonth)
    partPaymentDue.forEach((installment=>{
        balanceAmount += installment.balanceAmount;
    }))
    monthlyDueText.innerText = "Rs. "+balanceAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})
    //monthly due calculation end

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

    generateChart(chartRegistrationBreakdown,'',courseCode,'Registration Count',[{name: 'Courses', data: registrationCount, color: "#11306d"}])
}

const generateChartRegistrationCounsellorBreakdown =()=> {

    const startDateCurrentMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endDateCurrentMonth = moment().endOf('month').format('YYYY-MM-DD');

    //setting dashboard title
    dashboardCharTitle.innerHTML = '<small>The above charts are based on Registration data collected from ' + startDateCurrentMonth + ' to ' + endDateCurrentMonth+'</small>';

    const counsellors = ajaxGetRequest("/Registration/getCounsellors/" + startDateCurrentMonth + "/" + endDateCurrentMonth)
    let registrationCount = [];
    counsellors.forEach((counsellor) => {
        count = ajaxGetRequest("/Registration/getRegistrationCountByCounsellorsByMonth/" + startDateCurrentMonth + "/" + endDateCurrentMonth + "/" + counsellor);
        registrationCount.push({name: counsellor, y: count});
    })

    //generateChart(chartRegistrationCounsellorBreakdown,`${new Date().getFullYear()}-${new Date().toLocaleString('default', { month: 'short' })}`,counsellors,'Registration Count',[{name: 'Counsellors', data: registrationCount, color: "#11306d"}])
    generateMonochromePieChart('chartRegistrationCounsellorBreakdown', '', 'Registration Count', registrationCount)
}


const findRegistration=()=>{
    registrationNumber =quickPaymentRegistrationNumber.value;
    if(registrationNumber!=='') {

        registration = ajaxGetRequest("/Registration/getRegistrationByRegistrationNumber/" + registrationNumber);
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
            btnAddPayment.disabled = false;
            collapseRegistration.classList.add('show');
        }
        else{
            showCustomModal("No Registration Found for <br>Registration Number <span class='text-steam-green'> "+registrationNumber+"</span>",'error')
        }
    }
    else{
        showCustomModal("Registration Number is Required!",'warning')
    }
}

const resetQuickPaymentForm = ()=>{
    //remove collapse show class
    collapseRegistration.classList.remove('show');

    btnAddPayment.disabled = true;

    $("#quickPaymentMethod_chosen .chosen-single").removeClass('select-validated');
    quickPaymentMethod.classList.remove('is-valid');

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

const newQuickPaymentSubmit = ()=>{

    let errors = checkQuickPaymentFormErrors();
    if(errors==='') {

        showCustomConfirm("You are about to add a New Payment of <br><span class='text-steam-green'>Rs. " + parseFloat(newPayment.amount).toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }) + "</span> to the registration : <span class='text-steam-green'>" + registration.registrationNumber + "</span><br><br>Are You Sure?", function (result) {
            if (result) {

                const severResponse = ajaxHttpRequest("/Payment", "POST", newPayment);

                if (severResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Payment Successfully Added!<br><br>Please Wait Generating Invoice", "success");
                    refreshDashboardWidgets();
                    setTimeout(() => {
                        generateInvoice(ajaxHttpRequest('/Payment/getPaymentsByRegistrationID/' + newPayment.registrationID.id).pop());
                        resetQuickPaymentForm();
                    }, 2000)


                }
                else{
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed! <br>" + serviceResponse.responseJSON.error + " <span class='small'>(" + serviceResponse.responseJSON.status + ")</span>", "error");
                }
            }

            else
            {

            }
        });
    }
    else{
        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');
    }
}

const generateInvoice = (object)=>{
    let newWindow =   window.open()
    newWindow.document.write("<head>" +
        "    <meta charset='UTF-8'>" +
        "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
        "    <link href='/resources/bootstrap-5.2.3/css/bootstrap.min.css' rel='stylesheet' />" +
        "    <script src='/resources/bootstrap-5.2.3/js/bootstrap.bundle.js'></script>" +
        "    <title>Document</title>" +
        "    <style>" +
        "        * {" +
        "            margin: 0;" +
        "            padding: 0;" +
        "        }" +
        "" +
        "        .outer {" +
        "            width: 4in;" +
        "            height: 6in;" +
        "            outline: 1px solid #ddd;" +
        "            margin-top: 15px;" +
        "            margin-left: 15px;" +
        "            background: url('/resources/images/invoiceBackground.png');"+
        "            background-size: cover;"+

        "        }" +
        "    </style>" +
        "</head>" +
        "" +
        "<body>" +
        "    <div class='outer'>" +
        "        <div style='height:1in'></div>" +
        "        <div style='height: 1in' class='d-flex justify-content-center align-items-center'>" +
        "            <div>" +
        "                <h5 class='text-center mb-0'>STEAM Higher Education Institute</h4>" +
        "                    <p class='mb-0 text-center small'>No.10, Banduragoda Road, Veyangoda.</p>" +
        "                    <p class='mb-0 text-center small'>Tel: 071 9883073 | Email: info@steam.lk</p>" +
        "            </div>" +
        "        </div>" +
        "        <div class='d-flex justify-content-center align-items-center mt-3'>" +
        "" +
        "            <div class='m-0 p-0'>" +
        "                <table class='table table-bordered small mb-0'>" +
        "                    <tr>" +
        "                        <td class='fw-bold text-center' colspan='4'>Payment Receipt</td>" +
        "                    </tr>" +
        "                    <tr>" +
        "                        <td class='fw-bold'>Receipt No:</td>" +
        "                        <td>"+object.invoiceCode+"</td>" +
        "                        <td class='fw-bold'>Date:</td>" +
        "                        <td>"+object.timeStamp.split('T')[0]+"</td>" +
        "                    </tr>" +
        "                    <tr>" +
        "                        <td class='fw-bold'>Student Name:</td>" +
        "                        <td colspan='3'>"+object.registrationID.studentID.title+" "+object.registrationID.studentID.nameWithInitials+"</td>" +
        "                    </tr>" +
        "                    <tr>" +
        "                        <td class='fw-bold'>Sum of Rupees:</td>" +
        "                        <td colspan='3' class='text-capitalize'>"+numberstowords.toInternationalWords(object.amount)+" Only</td>" +
        "                    </tr>" +
        "                    <tr>" +
        "                        <td class='fw-bold'>Course/Batch:</td>" +
        "                        <td colspan='3'>"+object.registrationID.courseID.name+" ("+object.registrationID.batchID.batchCode+")</td>" +
        "                    </tr>" +
        "                    <tr>" +
        "                        <td class='fw-bold'>Payment Method:</td>" +
        "                        <td colspan='3'>"+object.paymentTypeID.name+"</td>" +
        "                    </tr>" +
        "                    <tr>" +
        "                        <td class='fw-bold'>Cashier:</td>" +
        "                        <td colspan='3'>"+object.addedBy+"</td>" +
        "                    </tr>" +
        "                    <tr>" +
        "                        <td class='fw-bold text-center' colspan='4'>Rs. "+object.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})+"</td>" +
        "                    </tr>" +
        "                </table>" +
        "                " +
        "                " +
        "            </div>" +
        "        </div>" +
        "        <div class='d-flex align-items-end justify-content-center mt-3'>" +
        "            " +
        "            <p class='text-muted small text-center mb-0'><small>This receipt was automatically generated by the" +
        "                system</small></span>" +
        "        </div>" +
        "    </div>" +
        "</body>");

    setTimeout(function (){
        newWindow.print();
    },200)

}

const checkQuickPaymentFormErrors = ()=>{
    //check for binding
    //0 isn't allowed as a payment
    // cant be larger than Total Outstanding
    let errors = ''
    if(newPayment.paymentTypeID==null){
        errors = errors + 'Payment Type is Required<br>';
    }
    if(newPayment.registrationID==null){
        errors = errors + 'Registration is Required<br>';
    }
    if(newPayment.amount==null){
        errors = errors + 'Amount is Required<br>';
    }
    if(newPayment.amount<=0){
        errors = errors + 'Amount Can Not Be Rs. 0.00<br>';
    }
    if(newPayment.amount>registration.balanceAmount){
        errors = errors +'The Current amount <span class="text-steam-green">Rs. '+newPayment.amount+ '.00</span> exceeds the total outstanding balance <span class="text-steam-green">Rs. '+registration.balanceAmount+'.00</span><br>';
    }
    return errors;
}