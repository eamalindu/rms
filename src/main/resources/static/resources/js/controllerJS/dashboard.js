window.addEventListener('load',()=>{

    //using refreshDashboardWidgets to refresh the dashboard widget values
    refreshDashboardWidgets();
    //using generateChartRegistrationBreakdown to generate the chart for registration breakdown
    generateChartRegistrationBreakdown();
    //using generateChartRegistrationCounsellorBreakdown to generate the chart for registration breakdown by counsellor
    generateChartRegistrationCounsellorBreakdown();
    //using resetQuickPaymentForm to reset the quick payment form
    resetQuickPaymentForm();

    //validation chosen select (for new quick payment)
    $("#quickPaymentMethod").chosen().change(function () {
        $("#quickPaymentMethod_chosen .chosen-single").addClass('select-validated');
    });
});

//creating a function to refresh the dashboard widgets when ever needed
const refreshDashboardWidgets = ()=>{

    //daily Income calculation start
    //get the daily payments from the database using ajaxGetRequest function and store it in dailyPayments variable
    const dailyPayments = ajaxGetRequest("/Payment/getDailyIncome");
    //create a variable to store the total daily payment and set the initial value to 0
    let dailyPayment=0;
    //use forEach function to loop through the dailyPayments array and add the amount to dailyPayment variable
    dailyPayments.forEach((payment)=>{
        dailyPayment += payment.amount;
    });
    //display the dailyPayment value in the dailyIncomeText element
    dailyIncomeText.innerText = "Rs. "+dailyPayment.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})
    //daily Income calculation end

    //monthly Income calculation start
    //get the monthly payments from the database using ajaxGetRequest function and store it in monthlyPayments variable
    const monthlyPayments = ajaxGetRequest("Payment/getMonthlyTotalPayment");
    //create a variable to store the total monthly payment and set the initial value to 0
    let monthlyPayment = 0;
    //use forEach function to loop through the monthlyPayments array and add the amount to monthlyPayment variable
    monthlyPayments.forEach((payment)=>{
        monthlyPayment += payment.amount;
    });
    //display the monthlyPayment value in the monthlyIncomeText element
    monthlyIncomeText.innerText = "Rs. "+monthlyPayment.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})
    //monthly Income calculation end

    //monthly due calculation start
    //get the start date of the current month using moment.js,format it into YYYY-MM-DD format and store it in startDateCurrentMonth variable
    const startDateCurrentMonth =  moment().startOf('month').format('YYYY-MM-DD');
    //get the end date of the current month using moment.js,format it into YYYY-MM-DD format and store it in endDateCurrentMonth variable
    const endDateCurrentMonth =  moment().endOf('month').format('YYYY-MM-DD');
    //get the due payments from the one time payment registrations from the database using ajaxGetRequest function and store it in fullPaymentDue variable
    const fullPaymentDue = ajaxGetRequest("/Registration/getMonthlyDueRegistration/"+startDateCurrentMonth+"/"+endDateCurrentMonth)
    //create a variable to store the total monthly due and set the initial value to 0
    let balanceAmount = 0
    //use forEach function to loop through the fullPaymentDue array and add the balanceAmount to balanceAmount variable
    fullPaymentDue.forEach((registration)=>{
        balanceAmount += registration.balanceAmount;
    })
    //get the due payments from the part payment registrations from the database using ajaxGetRequest function and store it in partPaymentDue variable
    const partPaymentDue = ajaxGetRequest("/InstallmentPlan/getMonthlyDueRegistration/"+startDateCurrentMonth+"/"+endDateCurrentMonth)
    //use forEach function to loop through the partPaymentDue array and add the balanceAmount to balanceAmount variable
    partPaymentDue.forEach((installment=>{
        balanceAmount += installment.balanceAmount;
    }))
    //display the balanceAmount value in the monthlyDueText element
    monthlyDueText.innerText = "Rs. "+balanceAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})
    //monthly due calculation end

}

//creating a function to generate the chart for registration breakdown when ever needed
const generateChartRegistrationBreakdown = ()=>{
    //get all the courses from the database using ajaxGetRequest function and store it in courses variable
    const courses = ajaxGetRequest("/Course/findall");
    //create a variable to store the course code from all the courses
    let courseCode = [];
    //create a variable to store the registration count from all the courses
    let registrationCount = [];
    //use forEach function to loop through the courses array and add the course code to courseCode variable and registration count to registrationCount variable
    courses.forEach((course)=>{
        courseCode.push(course.code);
        //get the monthly registrations for the current course from the database using ajaxGetRequest function and push the response array length to registrationCount variable
        registrationCount.push(ajaxGetRequest("/Registration/getMonthlyRegistrationByCourseID/"+course.id).length)
    });
    //display the contents of the both array in the console
    console.log(courseCode);
    console.log(registrationCount);
    //generate the chart using generateChart function
    generateChart(chartRegistrationBreakdown,'',courseCode,'Registration Count',[{name: 'Courses', data: registrationCount, color: {
            linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1
            },
            stops: [
                [0, '#5ecde1'],
                [1, '#2caee2']
            ]
        }}])
}

//creating a function to generate the chart for registration breakdown by counsellor when ever needed
const generateChartRegistrationCounsellorBreakdown =()=> {

    //get the start date of the current month using moment.js, format it into YYYY-MM-DD format and store it in startDateCurrentMonth variable
    const startDateCurrentMonth = moment().startOf('month').format('YYYY-MM-DD');
    //get the end date of the current month using moment.js, format it into YYYY-MM-DD format and store it in endDateCurrentMonth variable
    const endDateCurrentMonth = moment().endOf('month').format('YYYY-MM-DD');

    //setting dashboard title
    dashboardCharTitle.innerHTML = '<small>The above charts are based on Registration data collected from ' + startDateCurrentMonth + ' to ' + endDateCurrentMonth+'</small>';

    //get all the counsellors present in the date range from the database using ajaxGetRequest function and store it in counsellors variable
    const counsellors = ajaxGetRequest("/Registration/getCounsellors/" + startDateCurrentMonth + "/" + endDateCurrentMonth)
    //create a variable to store the registration count from all the counsellors
    let registrationCount = [];
    //use forEach function to loop through the counsellors array
    counsellors.forEach((counsellor) => {
        //get the monthly registrations for the current counsellor from the database using ajaxGetRequest function and store it in count variable
        count = ajaxGetRequest("/Registration/getRegistrationCountByCounsellorsByMonth/" + startDateCurrentMonth + "/" + endDateCurrentMonth + "/" + counsellor);
        //push the counsellor name and count to registrationCount variable
        registrationCount.push({name: counsellor, y: count});
    })

    //generate the chart using generateMonochromePieChart function
    generateMonochromePieChart('chartRegistrationCounsellorBreakdown', '', 'Registration Count', registrationCount)
}

//creating a function to find registration when ever needed
const findRegistration=()=>{
    //get the registration number from the quickPaymentRegistrationNumber element and store it in registrationNumber variable
    registrationNumber =quickPaymentRegistrationNumber.value;
    //check if the registration number is not empty
    if(registrationNumber!=='') {
        //this means the registration number is not empty
        //get the registration from the database using ajaxGetRequest function and store it in registration global variable
        registration = ajaxGetRequest("/Registration/getRegistrationByRegistrationNumber/" + registrationNumber);
        //check if the registration is not empty
        if(registration!==''){
            //this means the registration is not empty
            //display the student title with student name with initials in the quickPaymentStudentName element
            quickPaymentStudentName.innerText = registration.studentID.title +". "+registration.studentID.nameWithInitials;
            //display the course code in the quickPaymentCourseName element
            quickPaymentBatchCode.innerText = registration.batchID.batchCode;
            //check if the registration is a full payment or a part payment registration
            if(registration.isFullPayment) {
                //this means the registration is a full payment registration
                //display the payment plan as One Time Payment in the quickPaymentPaymentPlan element
                quickPaymentPaymentPlan.innerText = 'One Time Payment';
            }
            else{
                //this means the registration is a part payment registration
                //display the payment plan as Installment Plan in the quickPaymentPaymentPlan element
                quickPaymentPaymentPlan.innerText ='Installment Plan';
            }
            //display the total outstanding balance and format it into currency type using toLocalString function in the quickPaymentBalanceFee element
            quickPaymentBalanceFee.innerText = "Rs. "+registration.balanceAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

            //check the registration status and display the status in the quickPaymentRegistrationStatus element
            if (registration.registrationStatusID.name === "Active") {
                //this means the registration status is Active
                //display the status as Active in the quickPaymentRegistrationStatus element
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #3FB618">Active</span>';
            } else if (registration.registrationStatusID.name === "Suspended") {
                //this means the registration status is Suspended
                //display the status as Suspended in the quickPaymentRegistrationStatus element
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #ea8a1e">Suspended</span>';
            } else if (registration.registrationStatusID.name === "Cancelled") {
                //this means the registration status is Cancelled
                //display the status as Cancelled in the quickPaymentRegistrationStatus element
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #ea2f1e">Cancelled</span>';
            }
            else if (registration.registrationStatusID.name === "Pending"){
                //this means the registration status is Pending
                //display the status as Pending in the quickPaymentRegistrationStatus element
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #616161">Pending</span>';
            }
            else if (registration.registrationStatusID.name === "In Review"){
                //this means the registration status is In Review
                //display the status as In Review in the quickPaymentRegistrationStatus element
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #d8b73a">In Review</span>';
            }
            else{
                //this means the registration status is Deleted
                //display the status as Deleted in the quickPaymentRegistrationStatus element
                quickPaymentRegistrationStatus.innerHTML= '<span class="badge rounded-0 w-auto" style="background: #000">Deleted</span>';
            }
            //set the registration as registrationID for the newPayment object
            newPayment.registrationID = registration;
            //enable the add payment button
            btnAddPayment.disabled = false;
            //show the collapse by adding the show class
            collapseRegistration.classList.add('show');
        }
        else{
            //this means the registration is empty
            //display an error message to the user using showCustomModal function
            showCustomModal("No Registration Found for <br>Registration Number <span class='text-steam-green'> "+registrationNumber+"</span>",'error')
        }
    }
    else{
        //this means the registration number is empty
        //display an error message to the user using showCustomModal function
        showCustomModal("Registration Number is Required!",'warning')
    }
}

//creating a function to reset the quick payment form when ever needed
const resetQuickPaymentForm = ()=>{
    //remove collapse show class
    collapseRegistration.classList.remove('show');
    //disable the add payment button
    btnAddPayment.disabled = true;
    //remove the select-validated class from the quickPaymentMethod element
    $("#quickPaymentMethod_chosen .chosen-single").removeClass('select-validated');
    //remove the is-valid class from the quickPaymentMethod element
    quickPaymentMethod.classList.remove('is-valid');
    //reset the newPayment object
    newPayment = {}
    //reset the registration form
    frmQuickPayment.reset();

    //set default option chosen
    setTimeout(function () {
        $('#quickPaymentMethod').val('').trigger('chosen:updated');
    }, 0);

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newQuickPaymentInputs');
    inputs.forEach(function (input) {
        //remove inline css from the input
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });
    //get all the payment methods from the database using ajaxGetRequest function and store it in paymentMethods variable
    const paymentMethods = ajaxGetRequest('/PaymentType/findall');
    //using the external function fillSelectOptions to fill the data from the database to the select element (dynamic select)
    fillSelectOptions(quickPaymentMethod,' ',paymentMethods,'name')
    //initialize the chosen select
    $('#quickPaymentMethod').chosen({width: '100%'});
}

//creating a function to add a new payment when ever needed
const newQuickPaymentSubmit = ()=>{
    //check for errors in the form using checkQuickPaymentFormErrors function and store it in errors variable
    let errors = checkQuickPaymentFormErrors();
    //check if there are no errors
    //if it's empty that means all the required inputs are filled
    if(errors==='') {
        //this means there are no errors
        //get a user confirmation using external customConfirm js
        showCustomConfirm("You are about to add a New Payment of <br><span class='text-steam-green'>Rs. " + parseFloat(newPayment.amount).toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }) + "</span> to the registration : <span class='text-steam-green'>" + registration.registrationNumber + "</span><br><br>Are You Sure?", function (result) {
            //check if the user has confirmed the action
            if (result) {
                //this means the user has confirmed the action
                //save the new payment to the database using ajaxHttpRequest function by send a POST request to the backend
                //get the response from the backend using ajaxHttpRequest function and store it in severResponse variable
                const severResponse = ajaxHttpRequest("/Payment", "POST", newPayment);
                //check if the response is OK
                if (severResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show a success alert to the user using external-ModalFunction()
                    showCustomModal("Payment Successfully Added!<br><br>Please Wait Generating Invoice", "success");
                    //refresh the dashboard widgets
                    refreshDashboardWidgets();
                    //generate the invoice for the new payment after 2 seconds
                    setTimeout(() => {
                        //get all the payments for the registration from the database using ajaxHttpRequest function and pop the last payment
                        generateInvoice(ajaxHttpRequest('/Payment/getPaymentsByRegistrationID/' + newPayment.registrationID.id).pop());
                        //reset the quick payment form
                        resetQuickPaymentForm();
                    }, 2000)


                }
                else{
                    //this means there was a problem with the data passed to the backend
                    //show an error alert to the user using external-ModalFunction()
                    showCustomModal("Operation Failed! <br>" + serviceResponse, "error");
                }
            }

        });
    }
    else{
        //this means there are errors in the form
        //show the errors to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');
    }
}

//creating a function to generate the invoice for the new payment
//this function expect a payment object as a parameter
const generateInvoice = (object)=>{
    //create a new window using window.open function and store it in newWindow variable
    let newWindow =   window.open()
    //write the invoice content to the new window
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

    //print the invoice after 200 milliseconds
    setTimeout(function (){
        newWindow.print();
    },200)

}

//creating a function to check the quick payment form for errors
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
    //return the errors
    return errors;
}