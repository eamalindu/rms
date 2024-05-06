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

    $('#tblInquiry').DataTable();

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
    } else if (ob.registrationStatusID.name === 'Suspended') {
        registrationSheetCode.classList.add('text-warning');

        registrationSheetCode.classList.remove('text-success');
        registrationSheetCode.classList.remove('text-steam-green');
        registrationSheetCode.classList.remove('text-danger');
        registrationSheetCode.classList.remove('text-secondary');
    }

    else if(ob.registrationStatusID.name ==='Deleted'){
        btnRegistrationSheetDelete.style.display = 'none';
        registrationSheetCode.classList.remove('text-success');
        registrationSheetCode.classList.remove('text-warning');
        registrationSheetCode.classList.remove('text-danger');
        registrationSheetCode.classList.remove('text-steam-green');
        registrationSheetCode.classList.remove('text-secondary');
    }
    else if (ob.registrationStatusID.name==='Pending'){
        registrationSheetCode.classList.add('text-secondary');
        registrationSheetCode.classList.remove('text-success');
        registrationSheetCode.classList.remove('text-warning');
        registrationSheetCode.classList.remove('text-danger');
        registrationSheetCode.classList.remove('text-steam-green');

    }
    else {
        registrationSheetCode.classList.add('text-danger');

        registrationSheetCode.classList.remove('text-success');
        registrationSheetCode.classList.remove('text-warning');
        registrationSheetCode.classList.remove('text-steam-green');
        registrationSheetCode.classList.remove('text-secondary');
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

    //calculate dues and displaying it
    studentPaymentTabDues.innerText = "TBA";

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

// const getInvoice =(ob)=>{
//
//     return ' <button class="btn btn-sm btn-secondary rounded-0 small" style="width: 30px;height: 30px;"\n' +
//         '                                                onclick="window.location.href=\'invoice.html\'">\n' +
//         '                                            <i class="fa-solid fa-print small"></i>\n' +
//         '                                        </button>'
// }


const printInvoice = (object,index)=>{
    alert("hehe");

}
//reset chosen select using jquery
$('#btn-reset').on('click', function () {
    setTimeout(function () {
        $('.chosen-registration-search').trigger('chosen:updated');
    }, 0);
});

//function to toggle the visibility of the table when the h5 tag is clicked
const toggleRegistrationSheetTable =(HeadingTextID,TableID,iconSpanID)=>{
    HeadingTextID.addEventListener("click",()=>{
        if(TableID.style.display!=="none"){
            TableID.style.display = 'none';
            iconSpanID.innerHTML = '<i class="fa-solid fa-circle-chevron-down"></i>'
            HeadingTextID.classList.remove('border-bottom-0');
        }
        else{
            TableID.style.display = 'table';
            iconSpanID.innerHTML = '<i class="fa-solid fa-circle-chevron-up"></i>'
            HeadingTextID.classList.add('border-bottom-0');
        }

    })
}


const newPaymentSubmit=()=>{

    //attach the current registration object to the payment object
    //get the current registration object from rowView function
    newPayment.registrationID =oldRegistration;
    console.log(newPayment);
    showCustomConfirm("You are about to add a New Payment of <br><span class='text-steam-green'>Rs. "+parseFloat(newPayment.amount).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2})+"</span> to the registration : <span class='text-steam-green'>"+oldRegistration.registrationNumber+"</span><br><br>Are You Sure?", function (result) {
        if (result) {
            let serviceResponse = ajaxHttpRequest("/Payment", 'POST', newPayment);
            if (serviceResponse === "OK") {
                //this means data successfully passed to the backend
                //show an alert to user
                showCustomModal("Payment Successfully Added!", "success");

                //testing code
                btnModalAddPaymentClose.click();
                refreshRegistrationTable();
                const currentReg = ajaxGetRequest("/Registration/getRegistration/"+oldRegistration.id);
                rowView(currentReg)
                document.getElementById("pills-payment-tab").click();

            }
            else{
                //this means there was a problem with the query
                //shows an error alert to the user
                showCustomModal("Operation Failed! <br>" + serviceResponse.responseJSON.error +" <span class='small'>("+serviceResponse.responseJSON.status+")</span>", "error");
            }
        }
    });
}