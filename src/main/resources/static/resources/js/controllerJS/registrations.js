window.addEventListener("load", () => {

    //reset the registration form
    resetPaymentForm();
    //refresh the registration table
    refreshRegistrationTable();

    //refresh/refill search filters
    courses =  ajaxGetRequest("/Course/findall");
    fillSelectOptions(registrationSearchCourse, ' ', courses, 'name');

    registrationStatus = ajaxGetRequest("/RegistrationStatus/findall");
    fillSelectOptions(registrationSearchStatus,' ',registrationStatus,'name');

    //initialize the 3rd party libraries (chosen)
    $('.chosen-registration-search').chosen({width: '190px'});
    $('#registrationSearchDateRange').daterangepicker({
        "locale": {
            "format": "YYYY-MM-DD",
            //"separator": " to "
        }
    });

    //toggle the visibility of the table when the h5 tag is clicked
    toggleRegistrationSheetTable(curriculumHeadingText,tblCurriculum,curriculumHeadingIcon);
    toggleRegistrationSheetTable(marksHeadingText,tblMarks,marksHeadingIcon);
    toggleRegistrationSheetTable(paymentBreakdownHeadingText,tblPaymentBreakdown,paymentBreakdownHeadingIcon);
    toggleRegistrationSheetTable(installmentSummaryHeadingText,tblInstallments,installmentSummaryHeadingIcon);

    $("#paymentMethod").chosen().change(function () {
        $("#paymentMethod_chosen .chosen-single").addClass('select-validated');
    });

});

//creating a function to refresh the registrations table when ever needed
const refreshRegistrationTable = ()=>{

    const registrations = ajaxGetRequest("/Registration/findall");
    //creating a display property list for the batches
    displayPropertyListForBatches = [
        {property: 'registrationNumber', dataType: 'text'},
        {property: getStudentName, dataType: 'function'},
        {property: getCourseName, dataType: 'function'},
        {property: getContactNumber, dataType: 'function'},
        {property: getDate, dataType: 'function'},
        {property: 'addedBy', dataType: 'text'},
        {property: getStatus, dataType: 'function'},
    ];

    fillDataIntoTable(tblInquiry, registrations, displayPropertyListForBatches, rowView, 'offcanvasRegistrationSheet');

    if(registrations.length!==0) {
        $('#tblInquiry').DataTable();
    }

}

const getStudentName =(ob)=>{

    return ob.studentID.title+' '+ob.studentID.nameWithInitials+' <br/><span class="badge w-50 rounded-0" style="background: darkgrey">'+ob.studentID.studentNumber+'</span>';
}

const getCourseName =(ob)=>{

    return ob.courseID.name+' ('+ob.courseID.code+')<br/><small class="text-muted">'+ob.batchID.batchCode+'</small>';
}

const getContactNumber = (ob)=>{

    return ob.studentID.mobileNumber;
}


const getDate = (ob)=>{
    const [addedDate, addedTime] = ob.timestamp.split("T");
    return addedDate+'<br/><small class="text-muted">'+addedTime+'</small>';
}

const getStatus = (ob) => {
    if (ob.registrationStatusID.name === "Active") {
        return '<span class="badge rounded-0" style="background: #3FB618">Active</span>';
    } else if (ob.registrationStatusID.name === "Suspended") {
        return '<span class="badge rounded-0" style="background: #ea8a1e">Suspended</span>';
    } else if (ob.registrationStatusID.name === "Cancelled") {
        return '<span class="badge rounded-0" style="background: #ea2f1e">Cancelled</span>';
    }
    else if (ob.registrationStatusID.name === "Pending"){
        return '<span class="badge rounded-0" style="background: #616161">Pending</span>';
    }
    else if (ob.registrationStatusID.name === "In Review"){
        return '<span class="badge rounded-0" style="background: #d8b73a">In Review</span>';
    }
    else{
        return '<span class="badge rounded-0" style="background: #000">Deleted</span>';
    }


}
//creating a function to reset the payment form when ever needed
const resetPaymentForm=()=>{

    $("#paymentMethod_chosen .chosen-single").removeClass('select-validated');
    paymentMethod.classList.remove('is-valid');

    newPayment = {};

    frmNewPayment.reset();

    //set default option chosen
    setTimeout(function () {
        $('#paymentMethod').val('').trigger('chosen:updated');
    }, 0);

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newRegistrationPaymentInputs');
    inputs.forEach(function (input) {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

//setting payment inputs
    const paymentMethods = ajaxGetRequest('/PaymentType/findall');
    fillSelectOptions(paymentMethod,' ',paymentMethods,'name')
    $('#paymentMethod').chosen({width: '100%'});


}

const rowView=(ob,index)=>{
    //hide the update btn
    btnRegistrationSheetUpdate.style.display = 'none';
    //show the deleted btn
    btnRegistrationSheetDelete.style.display = 'block';
    //show the add payment btn
    document.getElementById('btn-add-payment').classList.remove('d-none')
    //hide the extra div
    extraInformationForRegistration.classList.add('d-none');

    //add the attribute disabled to make inputs block the user input values
    //remove the edited border colors from the inputs
    inputs = document.querySelectorAll('.registrationSheetInputs');
    inputs.forEach(function (input) {
        input.setAttribute('disabled', 'true');
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });


    //show the info tab first
    document.getElementById("pills-home-tab").click();

    //refill data
    registrationSheetCode.innerText = ob.registrationNumber;
    const [addedDate, addedTime] = ob.timestamp.split("T");
    registrationSheetJoinedDateText.innerHTML = addedDate+" at "+addedTime;
    registrationSheetStudentID.innerText = ob.studentID.studentNumber;
    registrationSheetStudentName.value=ob.studentID.title+" "+ob.studentID.nameWithInitials;
    registrationSheetCourse.value = ob.courseID.name;
    registrationSheetBatch.value = ob.batchID.batchCode;
    registrationSheetRegisteredBy.value = ob.addedBy;
    registrationSheetCommission.value = ob.commissionPaidTo;
    registrationSheetDiscountRate.value = ob.discountRate+"%";
    registrationSheetDiscountAmount.value = "Rs. "+ob.discountAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});


    let installmentPlanForCurrentRegistration = [];
    //check payment mode [full payment or part payment]
    if(ob.isFullPayment){
        registrationSheetPayment.value = "Full Payment";
    }
    else{
        registrationSheetPayment.value = "Installments"

        //This means current Registration have installments
        //get all the installments from the database and save it to installmentPlanForCurrentRegistration variable
         installmentPlanForCurrentRegistration = ajaxGetRequest("/InstallmentPlan/getInstallmentPlan/"+ob.id);

    }

    if (ob.registrationStatusID.name === 'Active') {
        registrationSheetCode.classList.add('text-success');

        registrationSheetCode.classList.remove('text-warning');
        registrationSheetCode.classList.remove('text-steam-green');
        registrationSheetCode.classList.remove('text-danger');
        registrationSheetCode.classList.remove('text-secondary');
        registrationSheetCode.classList.remove('text-in-review');
    } else if (ob.registrationStatusID.name === 'Suspended') {
        registrationSheetCode.classList.add('text-warning');

        registrationSheetCode.classList.remove('text-success');
        registrationSheetCode.classList.remove('text-steam-green');
        registrationSheetCode.classList.remove('text-danger');
        registrationSheetCode.classList.remove('text-secondary');
        registrationSheetCode.classList.remove('text-in-review');
    }

    else if(ob.registrationStatusID.name ==='Deleted'){
        btnRegistrationSheetDelete.style.display = 'none';
        registrationSheetCode.classList.remove('text-success');
        registrationSheetCode.classList.remove('text-warning');
        registrationSheetCode.classList.remove('text-danger');
        registrationSheetCode.classList.remove('text-steam-green');
        registrationSheetCode.classList.remove('text-secondary');
        registrationSheetCode.classList.remove('text-in-review');
    }
    else if (ob.registrationStatusID.name==='Pending'){
        registrationSheetCode.classList.add('text-secondary');
        registrationSheetCode.classList.remove('text-success');
        registrationSheetCode.classList.remove('text-warning');
        registrationSheetCode.classList.remove('text-danger');
        registrationSheetCode.classList.remove('text-steam-green');
        registrationSheetCode.classList.remove('text-in-review');

    }
    else if (ob.registrationStatusID.name==='In Review'){
        registrationSheetCode.classList.add('text-in-review');
        registrationSheetCode.classList.remove('text-success');
        registrationSheetCode.classList.remove('text-warning');
        registrationSheetCode.classList.remove('text-danger');
        registrationSheetCode.classList.remove('text-steam-green');
        registrationSheetCode.classList.remove('text-secondary');

    }
    else {
        registrationSheetCode.classList.add('text-danger');

        registrationSheetCode.classList.remove('text-success');
        registrationSheetCode.classList.remove('text-warning');
        registrationSheetCode.classList.remove('text-steam-green');
        registrationSheetCode.classList.remove('text-secondary');
        registrationSheetCode.classList.remove('text-in-review');
    }

    const registrationStatus = ajaxGetRequest("/RegistrationStatus/findall");
    fillSelectOptions(registrationSheetStatus, 'Please Select a Status', registrationStatus, 'name', ob.registrationStatusID.name)

    paymentSummaryFullAmount.innerText = "Rs. "+ob.fullAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    paymentSummaryPaidAmount.innerText = "Rs. "+ob.paidAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    paymentSummaryBalanceAmount.innerText = "Rs. "+ob.balanceAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    //Setting data for course Tab
    studentCourseTabNameWithInitials.innerText = ob.studentID.nameWithInitials;
    studentCourseTabBatchCode.innerText = ob.batchID.batchCode;

    //setting data for payment Tab
    if(ob.fullAmount===ob.balanceAmount){

        //no payment has been made
        studentPaymentTabStatus.innerHTML= '<span class="badge rounded-0" style="background: #ea2f1e;width: 100px!important;">Not Paid</span>';
    }
    else if(ob.balanceAmount===0) {

        //payment completed
        studentPaymentTabStatus.innerHTML= '<span class="badge rounded-0" style="background: #3FB618;width: 100px!important;">Completed</span>';
        document.getElementById('btn-add-payment').classList.add('d-none')
    } else {

        //payment is not completed but payments have been made
        studentPaymentTabStatus.innerHTML= '<span class="badge rounded-0" style="background: #ea8a1e;width: 100px!important;">Paid</span>';
    }

    studentPaymentTabPlan.innerHTML = '<p class="mb-0">'+(ob.isFullPayment ? 'One Time Payment':+ob.batchID.paymentPlanID.numberOfInstallments+' Easy Installment Plan')+'</p>'
    studentPaymentTabDiscount.innerHTML = '<p class="mb-0">'+ ob.discountRate + '% OFF<br><span class="text-muted small">Total Savings Rs. ' + ob.discountAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '</span>' + '</p>';


    //setting data to tblPaymentBreakdown
    studentPaymentTabCourseFee.innerText = "Rs. "+ob.batchID.paymentPlanID.courseFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    studentPaymentTabRegFee.innerText = "Rs. "+ob.batchID.paymentPlanID.registrationFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    studentPaymentTabDiscounts.innerText ="- Rs. "+ ob.discountAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    studentPaymentTabTotalFee.innerText = "Rs. "+ob.fullAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    studentPaymentTabAlreadyPaidFee.innerText = "Rs. "+ob.paidAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    studentPaymentTabBalanceFee.innerText = "Rs. "+ob.balanceAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

    //get due amount from the database for the current registration
    //use ajaxGetMapping to get the value
    const dueAmount = ajaxGetRequest("/InstallmentPlan/getDueInstallmentAmountFromRegistrationID/"+ob.id)

    if(dueAmount>0){
        studentPaymentTabDues.innerText = "Rs. "+dueAmount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    }
    else{
        //calculate dues and displaying it
        studentPaymentTabDues.innerText = "TBA";
    }



    const displayPropertyListForInstallmentPlan = [
        {property: getAmount, dataType: 'function'},
        {property: 'dueDate', dataType: 'text'},
        {property: getPaidAmount, dataType: 'function'},
        {property: getBalanceAmount, dataType: 'function'},
        {property: 'status', dataType: 'text'},
    ];

    fillDataIntoTableWithOutAction(tblInstallments,installmentPlanForCurrentRegistration,displayPropertyListForInstallmentPlan);

    const paymentHistory = ajaxGetRequest("/Payment/getPaymentsByRegistrationID/"+ob.id);
    const displayPropertyListForPaymentHistory = [
        {property:getPaymentDate,dataType:'function'},
        {property:getPaymentMethod,dataType:'function'},
        {property:getPaymentAmount,dataType:'function'},
        {property:'addedBy',dataType:'text'},
    ];

    fillDataIntoTableWithPrint(tblPaymentHistory,paymentHistory,displayPropertyListForPaymentHistory,printInvoice)

    //This code snippet will save the current object student sub object to the global variable studentRecordToBeEdited;
    registrationSheetStudentID.addEventListener("click",()=>{

        //hide the update button
        btnStudentModalUpdate.style.display = 'none';

       const studentRecordToBeEdited = ob.studentID;

       //set student info
        StudentModalCode.innerText = studentRecordToBeEdited.studentNumber;
        StudentModalJoinedDateText.innerText = studentRecordToBeEdited.timeStamp.replace("T"," at ");
        StudentModalNameWithInitials.value =  studentRecordToBeEdited.nameWithInitials;
        StudentModalFullName.value =  studentRecordToBeEdited.fullName;
        StudentModalDob.value =  studentRecordToBeEdited.dob;
        StudentModalMobile.value =  studentRecordToBeEdited.mobileNumber;
        StudentModalAddress1.value =  studentRecordToBeEdited.addressLine1;
        StudentModalAddress2.value =  studentRecordToBeEdited.addressLine2;
        StudentModalCity.value =  studentRecordToBeEdited.city;
        StudentModalEmail.value = studentRecordToBeEdited.email;
        StudentModalIDValue.value = studentRecordToBeEdited.idValue;
        StudentModalGuardian.value = studentRecordToBeEdited.guardianName;
        StudentModalGuardianContactNumber.value = studentRecordToBeEdited.guardianContactNumber;

        //setting radio button
        if(studentRecordToBeEdited.title==="Mr"){
            studentModalMr.checked = true;
        }
        if(studentRecordToBeEdited.title==="Ms"){
            studentModalMs.checked = true;
        }
        if(studentRecordToBeEdited.title==="Mrs"){
            studentModalMrs.checked = true;
        }
        //setting custom radio button
        if (studentRecordToBeEdited.gender ==="Male") {
            StudentModalGender.checked = false;
            rightFemale.classList.remove('bg-success', 'text-white');
            leftMale.classList.add('bg-success', 'text-white');

        } else {
            StudentModalGender.checked = true;
            rightFemale.classList.add('bg-success', 'text-white');
            leftMale.classList.remove('bg-success', 'text-white');

        }
        //setting language
        studentModalLang.value = studentRecordToBeEdited.language;

        //setting idType
        StudentModalIDType.value = studentRecordToBeEdited.idType;

        //setting guardian relationship
        StudentModalRelationship.value = studentRecordToBeEdited.guardianRelationship;

        //setting dateRangePicker for dob
        $('#StudentModalDob').daterangepicker({
            "Date": studentRecordToBeEdited.dob,
            "singleDatePicker": true,
            "linkedCalendars": false,
            "showCustomRangeLabel": false,
            "autoUpdateInput": false,
            "drops": "down",
            "locale": {
                "format": "YYYY-MM-DD"
            }
        });

        //catch old Batch and new Batch
        oldStudent = JSON.parse(JSON.stringify(studentRecordToBeEdited));
        editedStudent = JSON.parse(JSON.stringify(studentRecordToBeEdited));



    })

    //check the registration have a pending registration status override
    if(ob.overrideReason!=null){
        extraInformationForRegistration.classList.remove('d-none');
        reasonForOverride.innerText = ob.overrideReason;

    }

    //catch old Registration and edited Registration
    oldRegistration = JSON.parse(JSON.stringify(ob));
    editedRegistration= JSON.parse(JSON.stringify(ob));
}

const getAmount = (ob)=>{

    return 'Rs. '+ob.payment.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})
}

const getPaidAmount = (ob)=>{
    return 'Rs. '+ob.paidAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})
}

const getBalanceAmount = (ob)=>{
    return 'Rs. '+ob.balanceAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})
}


const getPaymentDate = (ob)=>{

    return ob.timeStamp.split("T")[0];
}

const getPaymentMethod = (ob)=>{
    return ob.paymentTypeID.name;
}

const getPaymentAmount = (ob)=>{
    return "Rs. "+ob.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
}


const printInvoice = (object,index)=>{
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
//reset chosen select using jquery
$('#btn-reset').on('click', function () {
    setTimeout(function () {
        $('.chosen-registration-search').trigger('chosen:updated');
    }, 0);
});


const newPaymentSubmit=()=>{

    //attach the current registration object to the payment object
    //get the current registration object from rowView function
    newPayment.registrationID =oldRegistration;
    console.log(newPayment);
    let errors = checkPaymentFormErrors();
    if(errors==='') {
        showCustomConfirm("You are about to add a New Payment of <br><span class='text-steam-green'>Rs. " + parseFloat(newPayment.amount).toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }) + "</span> to the registration : <span class='text-steam-green'>" + oldRegistration.registrationNumber + "</span><br><br>Are You Sure?", function (result) {
            if (result) {
                let serviceResponse = ajaxHttpRequest("/Payment", 'POST', newPayment);
                if (serviceResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Payment Successfully Added!", "success");

                    //testing code
                    btnModalAddPaymentClose.click();
                    refreshRegistrationTable();
                    const currentReg = ajaxGetRequest("/Registration/getRegistration/" + oldRegistration.id);
                    rowView(currentReg)
                    document.getElementById("pills-payment-tab").click();

                } else {
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed! <br>" + serviceResponse.responseJSON.error + " <span class='small'>(" + serviceResponse.responseJSON.status + ")</span>", "error");
                }
            }
        });
    }
    else{

        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');
    }
}

const checkPaymentFormErrors = ()=>{
    //check for binding
    //0 isn't allowed as a payment
    // cant be larger than Total Outstanding
    let errors = ''
    if(newPayment.paymentTypeID==null){
        errors = errors + 'Payment Type is Required<br>';
    }
    if(newPayment.amount==null){
        errors = errors + 'Amount is Required<br>';
    }
    if(newPayment.amount<=0){
        errors = errors + 'Amount Can Not Be Rs. 0.00<br>';
    }
    if(newPayment.amount>oldRegistration.balanceAmount){
        errors = errors +'The Current amount <span class="text-steam-green">Rs. '+newPayment.amount+ '.00</span> exceeds the total outstanding balance <span class="text-steam-green">Rs. '+oldRegistration.balanceAmount+'.00</span><br>';
    }
    return errors;
}

const registrationEdit=()=>{

    //switch to info tab first
    document.getElementById('pills-home-tab').click();

    //getting the toast from its ID
    var myToastEl = document.getElementById('myToast');
    var myToast = new bootstrap.Toast(myToastEl);
    //Displaying toast
    myToast.show();
    //hide the toast after 5s
    setTimeout(function () {
        myToast.hide();
    }, 5000);

    //display the update button once the edit button is clicked
    btnRegistrationSheetUpdate.style.display = 'block';

    //remove the attribute readonly to make inputs accept the user input values
    //give a border color to inputs indicate that the input's values are ready to be edited
    inputs = document.querySelectorAll('.registrationSheetInputs');

    //remove the disabled attribute from the select
    //give a border color to indicate that select can be now edited

    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
        input.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    });
}

const registrationUpdate = ()=>{
    //calling the checkBatchFormErrors function and catching the return value to errors variable
    if(oldRegistration.registrationStatusID.name!=='In Review') {
        let updates = checkForRegistrationUpdate();
        if (updates === '') {
            showCustomModal("No changes Detected!", "info");
        } else {
            showCustomConfirm("You are About to Update this Registration<br><br>Following Changes Detected!<br/><br/><small>" + updates + "</small><br>Are You Sure?", function (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                if (result) {
                    //set values to modal
                    currentRegStatus.innerText = oldRegistration.registrationStatusID.name;
                    editedRegStatus.innerText = editedRegistration.tempRegistrationStatus.name;

                    $('#modalChangeRegStatus').modal('show');

                    btnSubmitOverride.addEventListener('click', () => {
                        if (editedRegistration.overrideReason != null) {
                            editedRegistration.tempRegistrationStatus = editedRegistration.tempRegistrationStatus.id;
                            let serviceResponse = ajaxHttpRequest("/Registration", "PUT", editedRegistration);
                            if (serviceResponse === "OK") {
                                //this means data successfully passed to the backend
                                //show an alert to user
                                showCustomModal("Registration Override Submitted!", "success");
                                //close the modal
                                //clear modal inputs
                                //close the offcanvas
                                //refresh table

                            } else {
                                showCustomModal("Operation Failed!" + serviceResponse, "error")
                            }
                        } else {
                            showCustomModal("Override Reason is required", "warning");
                        }
                    });


                } else {
                    showCustomModal("Operation Cancelled!", "info");
                }
            });
        }
    }
    else{
        showCustomModal("Registration Update Unavailable<br><br>This registration is under review.<br>Please wait until the review is complete.","error");
    }

}

const checkForRegistrationUpdate = ()=>{
    let updates = '';
    if (editedRegistration.tempRegistrationStatus !== null) {
        updates = updates + "Registration Staus was changed to <span class='text-steam-green'>" + editedRegistration.tempRegistrationStatus.name + "</span><br>";
    }
    return updates;
}
