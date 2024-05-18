window.addEventListener("load",()=>{

    registration = {};


    courses =  ajaxGetRequest("/Course/findall");
    displayPropertyListForCourse = [
        {property: 'name',dataType: 'text'},
        {property: 'code',dataType: 'text'},
        {property: getDuration,dataType: 'function'},
        {property: 'minimumRequirement',dataType: 'text'},
        {property: 'lectureHours',dataType: 'text'},
        {property: getStatus,dataType: 'function'},
    ]

    // fillDataIntoTableWithRadio(tblCourses,courses,displayPropertyListForCourse,radioFunction,'course');
    // $('#tblCourses').DataTable();

    createCourseRadioCards(courses,handleCourseCardClick,testA);
    resetStudentForm();
    resetPaymentForm();

    $("#studentIdOption").chosen().change(function () {
        $("#studentIdOption_chosen .chosen-single").addClass('select-validated');
    });$("#studentLang").chosen().change(function () {
        $("#studentLang_chosen .chosen-single").addClass('select-validated');
    });$("#studentGuardianRelationship").chosen().change(function () {
        $("#studentGuardianRelationship_chosen .chosen-single").addClass('select-validated');
    });
    $("#paymentMethod").chosen().change(function () {
        $("#paymentMethod_chosen .chosen-single").addClass('select-validated');
    });

});

const getDuration=(ob)=>{
    return ob.duration +" Months";
}

const getStatus=(ob)=>{
    if(ob.status){
        return '<span class="badge rounded-0" style="background: #3FB618">Active</span>';
    }
    else{
        return '<span class="badge rounded-0" style="background: #FF0039">Inactive</span>';
    }
}

const radioFunction = (ob,index)=>{
    textSelectedCourse.innerText = ob.name+" ("+ob.code+")";
    registration.courseID =ob;

}


//get all the steppers
let step1 = document.querySelector('#btn-course');
let step2 = document.querySelector('#btn-batch');
let step3 = document.querySelector('#btn-payment-str');
let step4 = document.querySelector('#btn-student');
let step5 = document.querySelector('#btn-add-payment');
let step6 = document.querySelector('#btn-complete');

//get all the footers
let footer_1 = document.querySelector('#step-course');
let footer_2 = document.querySelector('#step-batch');
let footer_3 = document.querySelector('#step-payment-str');
let footer_4 = document.querySelector('#step-student');
let footer_5 = document.querySelector('#step-add-payment');
let footer_6 = document.querySelector('#step-complete');

let next0 = () => {

    if(registration.courseID !=null) {
        console.log(registration);
        //footer_1 should have a selected at least one before executing the bellow code
        footer_1.classList.remove('show');
        footer_2.classList.add('show');
        step1.classList.add('custom-step-complete');
        document.querySelector('#btn-course .step-number span').innerText = '✔';

        //get all the batches(from selected course) and fill them into the tables

        weekDayBatches = ajaxGetRequest("/Batch/getActiveWeekDayBatch/"+registration.courseID.id);
        weekEndBatches = ajaxGetRequest("/Batch/getActiveWeekEndBatch/"+registration.courseID.id);
        test = ajaxGetRequest("/Batch/findall")

        displayPropertyListForWeekDay = [
            {property: 'batchCode',dataType: 'text'},
            {property: 'commenceDate',dataType: 'text'},
            {property: 'endDate',dataType: 'text'},
            {property: 'seatCount',dataType: 'text'},
            {property: 'description',dataType: 'text'},

        ];

        displayPropertyListForWeekEnd = [
            {property: 'batchCode',dataType: 'text'},
            {property: 'commenceDate',dataType: 'text'},
            {property: 'endDate',dataType: 'text'},
            {property: 'seatCount',dataType: 'text'},
            {property: 'description',dataType: 'text'},

        ];
        //fillDataIntoTableWithRadio(tblWeekDayBatches,weekDayBatches,displayPropertyListForWeekDay,radioFunctionForWeekDay,'batch');
        // fillDataIntoTableWithRadio(tblWeekEndBatches,weekEndBatches,displayPropertyListForWeekEnd,radioFunctionForWeekEnd,'batch');
        createBatchRadioCards(weekDayBatches,handleBatchCardClick,containerA);
        createBatchRadioCards(weekEndBatches,handleBatchCardClick,containerB);
        if(weekEndBatches.length===0){
            containerB.innerHTML = '<p class="text-red text-center small">No Active Weekend Batches Available! <br>Please Contact <strong>'+registration.courseID.name+'</strong> Course Coordinator</p>';
        }
        if(weekDayBatches.length===0){
            containerA.innerHTML = '<p class="text-red text-center small">No Active Weekday Batches Available! <br>Please Contact <strong>'+registration.courseID.name+'</strong> Course Coordinator</p>';
        }



    }
    else{
        showCustomModal("Please Select a Course !","warning");
    }

}
let next1 = () => {

    if(registration.batchID !=null) {
        console.log(registration);
        //footer_2 should have a selected at least one before executing the bellow code
        footer_2.classList.remove('show');
        footer_3.classList.add('show');
        step2.classList.add('custom-step-complete');
        document.querySelector('#btn-batch .step-number span').innerText = '✔';

        //check the standard 0% discount radio
        radioStandardFullPayment.checked = true;
        //set the isFullPayment to true
        registration.isFullPayment = true;

    }
    else{
        showCustomModal("Please Select a Batch !","warning");
    }
}
let next2 = () => {
    footer_3.classList.remove('show');
    footer_4.classList.add('show');
    step3.classList.add('custom-step-complete');
    document.querySelector('#btn-payment-str .step-number span').innerText = '✔';

    document.getElementById('btn-new-student').classList.remove('disabled');
    document.getElementById('btn-search-student').classList.remove('disabled');

    console.log(registration);

}

let next3= ()=>{
    let isRegistrationSuccess ;
    if (registration.studentID != null) {
    showCustomConfirm("You are about to add a New Registration to the batch <span class='text-steam-green'>"+registration.batchID.batchCode+"</span><br>Are You Sure?", function (result) {
        if (result) {
                //unfinished code start
                if (registration.isFullPayment) {
                    const server = ajaxHttpRequest("/Registration", "POST", registration)
                    if (server === "OK") {
                        showCustomModal("Registration Successfully Added!","success");

                        isRegistrationSuccess = true;

                    } else {

                        showCustomModal("Operation Failed! <br>" + server , "error");
                        isRegistrationSuccess = false;
                    }
                } else {
                    const serverResult = ajaxHttpRequest("/InstallmentPlan", "POST", installmentPlan);
                    if (serverResult === "OK") {
                        showCustomModal("Registration Successfully Added!","success");
                        isRegistrationSuccess = true;

                    } else {
                        showCustomModal("Operation Failed! <br>" + serverResult , "error");
                        isRegistrationSuccess = false;
                    }
                }
                //unfinished code end

            if(isRegistrationSuccess){
                footer_4.classList.remove('show');
                footer_5.classList.add('show');
                step4.classList.add('custom-step-complete');
                document.querySelector('#btn-student .step-number span').innerText = '✔';
            }


        }
        else{
            showCustomModal("Operation Cancelled!", "info");
        }
    });
    } else {
        showCustomModal("Please Select a Student or Add a New Student!", "warning");
    }

    //setting payment breakdown table info
    newPaymentCourseFee.innerText = "Rs. "+registration.batchID.paymentPlanID.courseFee.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
    newPaymentTabRegFee.innerText = "Rs. "+registration.batchID.paymentPlanID.registrationFee.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
    if(registration.discountAmount===undefined){
        registration.discountAmount = 0;
    }
    newPaymentTabDiscounts.innerText = "- Rs. "+registration.discountAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
    newPaymentTotalFee.innerText = "Rs. "+registration.fullAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});

}
let next4= ()=>{
    step5.classList.add('custom-step-complete');
    document.querySelector('#btn-add-payment .step-number span').innerText = '✔';

    //add print receipt logic here
}
let next5 = ()=>{
    step6.classList.add('custom-step-complete');
    document.querySelector('#btn-complete .step-number span').innerText = '✔';


    footer_5.classList.remove('show');
    footer_6.classList.add('show');
}

let previous0 = () => {
    footer_1.classList.add('show');
    footer_2.classList.remove('show');
    step1.classList.remove('custom-step-complete');
    document.querySelector('#btn-course .step-number span').innerText = '1';

    //all the values should be null expect the course
    registration.batchID = null;

}
let previous1 = () => {
    if(registration.courseID!==undefined) {
        //footer_1 value should be present in order to execute the following code -> use if
        footer_2.classList.add('show');
        footer_3.classList.remove('show');
        step2.classList.remove('custom-step-complete');
        document.querySelector('#btn-batch .step-number span').innerText = '2';
    }
    else{
        showCustomModal("Please Complete The Previous Step !","warning");

    }



}
let previous2 = () => {
    if(registration.courseID!==undefined || registration.batchID!==undefined) {
        footer_3.classList.add('show');
        footer_4.classList.remove('show');
        step3.classList.remove('custom-step-complete');
        document.querySelector('#btn-payment-str .step-number span').innerText = '3';

    }
    else{
        showCustomModal("Please Complete The Previous Step !","warning");

    }


}

const radioFunctionForWeekDay = (ob,index)=>{

    registration.batchID = ob;
    //load fee for full payment
    loadFee(ob,txtTotalFeeFullPayment,txtRegistrationFeeFullPayment,txtCourseFeeFullPayment,true);
    //load fee for installment payment
    loadFee(ob,txtTotalFeePartPayment,txtRegistrationFeePartPayment,txtCourseFeePartPayment,false);
}

const radioFunctionForWeekEnd = (ob,index)=>{

    registration.batchID = ob;
    //load fee for full payment
    loadFee(ob,txtTotalFeeFullPayment,txtRegistrationFeeFullPayment,txtCourseFeeFullPayment,true);
    //load fee for installment payment
    loadFee(ob,txtTotalFeePartPayment,txtRegistrationFeePartPayment,txtCourseFeePartPayment,false);

}


const calculateDiscount = (elementID,totalFee,registrationFee,courseFee,discount)=>{

    if(elementID.checked){



        //calculate discount amount and update relevant fields
        discountReceived = (courseFee * (discount)/100);
        finalCourseFee = (courseFee - discountReceived);
        finalTotalFee =  finalCourseFee + registrationFee;

        registration.isFullPayment = true;
        registration.oneTimePaymentAmount = finalTotalFee;
        registration.discountRate = discount;
        registration.discountAmount = discountReceived;

        //new code for biding total amount,paid and balance amount to registration object
        registration.fullAmount = finalTotalFee;
        registration.paidAmount = 0;
        registration.balanceAmount = finalTotalFee;

        lblDiscountFeeHeading.innerHTML = "Discount "+discount+"% Off";

        txtRegistrationFeeFullPayment.innerHTML = "Rs. "+ registrationFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        txtCourseFeeFullPayment.innerHTML = "Rs. "+ courseFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        txtTotalDiscountFeeFullPayment.innerHTML = "- Rs. "+discountReceived.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        txtTotalFeeFullPayment.innerHTML = "Rs. "+ finalTotalFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});



    }

}

const loadFee = (ob,totalFeeInputID,registrationFeeInputID,courseFeeInputID,isFullPayment)=>{

    totalFeeInputID.innerHTML = "Rs. "+(ob.paymentPlanID.totalFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    registrationFeeInputID.innerHTML = "Rs. "+(ob.paymentPlanID.registrationFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    courseFeeInputID.innerHTML = "Rs. "+(ob.paymentPlanID.courseFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});


    tblInstallments.children[1].innerHTML = '';

    if(isFullPayment) {
        txtTotalDiscountFeeFullPayment.innerHTML = "-Rs. 0.00";
        registration.oneTimePaymentAmount = ob.paymentPlanID.totalFee;
        registration.fullAmount = ob.paymentPlanID.totalFee;
        registration.paidAmount = 0;
        registration.balanceAmount = ob.paymentPlanID.totalFee;

    }


}

const calculateInstallments =(elementID,totalFee,registrationFee,courseFee,installments)=>{
    if(elementID.checked){
        installmentPlan=[];
        registration.isFullPayment = false;
        registration.oneTimePaymentAmount =null;
        registration.fullAmount = totalFee;
        registration.paidAmount = 0;
        registration.balanceAmount = totalFee;
        registration.discountRate = 0;
        registration.discountAmount = 0;

        tblInstallments.classList.remove('d-none');
        const installmentFee = courseFee / installments;
        let currentDate = new Date();

        const tbody = tblInstallments.children[1];
        //clear the table body
        tbody.innerHTML = '';

        // Display the first installment
        const firstTR = document.createElement('tr');

        const firstTD = document.createElement('td');
        firstTD.innerText = "1";
        firstTR.appendChild(firstTD);

        const secondTD = document.createElement('td');
        secondTD.innerText = (installmentFee + registrationFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        firstTR.appendChild(secondTD);

        const thirdTD = document.createElement('td');
        thirdTD.innerText = currentDate.toISOString().slice(0, 10);
        firstTR.appendChild(thirdTD);
        tbody.appendChild(firstTR);

        installmentPlan.push({ installmentNumber: 1, payment: (installmentFee + registrationFee),paidAmount:0,balanceAmount:(installmentFee + registrationFee),dueDate: currentDate.toISOString().slice(0, 10),status:"Not Paid",registrationID:registration});

        // Display the subsequent installments
        for (let i = 1; i < installments; i++) {
            // Calculate the new date for each installment
            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());

            const tr = document.createElement('tr');

            const installmentTD = document.createElement('td');
            installmentTD.innerText = i + 1;
            tr.appendChild(installmentTD);

            const installmentAmountTD = document.createElement('td');
            installmentAmountTD.innerText = (installmentFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            tr.appendChild(installmentAmountTD);

            const installmentDateTD = document.createElement('td');
            installmentDateTD.innerText = newDate.toISOString().slice(0, 10);
            tr.appendChild(installmentDateTD);

            currentDate = newDate; // Update currentDate for the next iteration


            tbody.appendChild(tr);
            installmentPlan.push({ installmentNumber: i+1, payment: installmentFee,paidAmount:0,balanceAmount:installmentFee,dueDate: newDate.toISOString().slice(0, 10),status:"Not Paid",registrationID:registration});
        }

    }

}

const handleBatchCardClick = (object, index) => {
    console.log(object);
    registration.batchID = object;
    loadFee(object,txtTotalFeeFullPayment,txtRegistrationFeeFullPayment,txtCourseFeeFullPayment,true);
    //load fee for installment payment
    loadFee(object,txtTotalFeePartPayment,txtRegistrationFeePartPayment,txtCourseFeePartPayment,false);
};

const handleCourseCardClick = (object , index)=>{
    console.log(object);
    registration.courseID = object;
}

const resetStudentForm = ()=>{
    frmNewStudent.reset();

    $("#studentIdOption_chosen .chosen-single").removeClass('select-validated');
    $("#studentLang_chosen .chosen-single").removeClass('select-validated');
    $("#studentGuardianRelationship_chosen .chosen-single").removeClass('select-validated');
    studentIdOption.classList.remove('is-valid');
    studentLang.classList.remove('is-valid');
    studentGuardianRelationship.classList.remove('is-valid');

    //reset student object
    newStudent ={};

    //set default option chosen
    setTimeout(function () {
        $('#studentIdOption').val('').trigger('chosen:updated');
        $('#studentLang').val('').trigger('chosen:updated');
        $('#studentGuardianRelationship').val('').trigger('chosen:updated');
    }, 0);

    //reset checkbox
    checkBoxValidator(radioGender, leftMale, rightFemale, 'newStudent', 'gender', 'Female', 'Male');

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newStudentInputs');
    inputs.forEach(function (input) {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    $("#studentLang").chosen({width: '100%', disable_search: true});
    $("#studentIdOption").chosen({width: '100%', disable_search: true});
    $("#studentGuardianRelationship").chosen({width: '100%', disable_search: true});
    $('#studentDOB').daterangepicker({
        "drops": "up",
        "singleDatePicker": true,
        "showDropdowns": true,
        "autoUpdateInput": false,
        maxDate: new Date(),
        locale: {
            format: 'YYYY-MM-DD'
        }
    });
    $('#studentDOB').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        inputTextValidator(this, '^(19[89][0-9]|20[0-9]{2})[-][0-9]{2}[-][0-9]{2}$', 'newStudent', 'dob');

    });

}

const automateGender = ()=>{
    if(studentMr.checked){
        radioGender.checked = false;
        checkBoxValidator(radioGender, leftMale, rightFemale, 'newStudent', 'gender', 'Female', 'Male');

    }
    if(studentMs.checked || studentMrs.checked){
        radioGender.checked =true;
        checkBoxValidator(radioGender, leftMale, rightFemale, 'newStudent', 'gender', 'Female', 'Male');


    }
}

const automateInitials = ()=>{
    let fullname = studentFullName.value.split(" ");
    let initialsName = '';
    fullname.forEach((word, index) => {
        if (index < fullname.length - 1) {
            initialsName += word[0] + ".";

        }
        else{
            initialsName += word;
        }
    });
    studentNameWithInitials.value=initialsName;
    inputTextValidator(studentNameWithInitials,'^[A-Z][.][A-Z][.][A-Z][.][A-Z][a-z]{5,}$','newStudent','nameWithInitials')

}

const newStudentSubmit = ()=>{
    console.log(newStudent);
    let errors = checkStudentFormErrors();
    if(errors === '')
    {
        showCustomConfirm("You are about to add a New Student<br>Are You Sure?", function (result) {
            if (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                let serviceResponse = ajaxHttpRequest("/Student", 'POST', newStudent);
                //check the serviceResponse value is "OK"
                if (serviceResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Student Successfully Added!<br><br>Please save the registration now", "success");
                    //close the student offcanvas
                    offCanvasStudentCloseButton.click();

                    //attach the student Objetc to the regitration(this wont work need to request it from database again)

                    registration.studentID = newStudent;
                    //ajaxGetRequest("/Student/getStudentByIdValue/"+newStudent.idValue);

                    //refresh the form
                    resetStudentForm();

                    //disable the add new student btn
                    document.getElementById('btn-new-student').classList.add('disabled');
                    document.getElementById('btn-search-student').classList.add('disabled');

                } else {
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed! <br>" + serviceResponse , "error");
                }
            }
                //will execute this block if the user confirmation is "no"
            //show user an alert
            else {
                showCustomModal("Operation Cancelled!", "info");
            }

        });
    }
    else{
        showCustomModal(errors, 'warning');
    }

}

const searchStudent=()=>{
    const searchText = studentSearchID.value;
    responseStudent = ajaxGetRequest("/Student/getStudentByIdValue/"+searchText);
    console.log(responseStudent);
    createStudentRadioCards(responseStudent,handleStudentCardClick,existStudentResults);
}

const handleStudentCardClick=(object)=>{
    registration.studentID = object;

}

const checkStudentFormErrors = () => {
    let errors = '';
    if(newStudent.title==null){
        errors = errors + 'Title is Required<br>';
    }
    if(newStudent.fullName==null){
        errors = errors + 'Full Name is Required<br>';
    }
    if(newStudent.nameWithInitials==null){
        errors = errors + 'Name With Initials is Required<br>';
    }
    if(newStudent.gender==null){
        errors = errors + 'Gender is Required<br>';
    }
    if(newStudent.dob==null){
        errors = errors + 'DOB is Required<br>';
    }
    if(newStudent.language==null){
        errors = errors + 'Language is Required<br>';
    }
    if(newStudent.mobileNumber==null){
        errors = errors + 'Mobile Number is Required<br>';
    }
    if(newStudent.addressLine1==null){
        errors = errors + 'Address Line 1 is Required<br>';
    }
    if(newStudent.city==null){
        errors = errors + 'City is Required<br>';
    }
    if(newStudent.idType==null){
        errors = errors + 'ID Type is Required<br>';
    }
    if(newStudent.idValue==null){
        errors = errors + 'ID Value is Required<br>';
    }
    if(newStudent.guardianName==null){
        errors = errors + 'Guardian Name is Required<br>';
    }
    if(newStudent.guardianRelationship==null){
        errors = errors + 'Guardian Relationship is Required<br>';
    }
    if(newStudent.guardianContactNumber==null){
        errors = errors + 'Guardian Contact Number is Required<br>';
    }

    return errors;
}

const resetPaymentForm = ()=>{

    $("#paymentMethod_chosen .chosen-single").removeClass('select-validated');
    paymentMethod.classList.remove('is-valid');

    newPayment = {};

    frmAddNewPayment.reset();

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
const newPaymentSubmit=()=>{

    //attach the current registration object to the payment object
    //get the current registration object from rowView function
    currentRegistration = ajaxGetRequest("/Registration/getRegistrationFromBatchAndStudentNIC/"+registration.batchID.id+"/"+registration.studentID.idValue);

    newPayment.registrationID =currentRegistration;
    let errors = checkPaymentFormErrors();
    if(errors==='') {
        showCustomConfirm("You are about to add a New Payment of <br><span class='text-steam-green'>Rs. " + parseFloat(newPayment.amount).toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }) + "</span> <br><br>Are You Sure?", function (result) {
            if (result) {
                let serviceResponse = ajaxHttpRequest("/Payment", 'POST', newPayment);
                if (serviceResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Payment Successfully Added!", "success");

                    resetPaymentForm();
                    next4();
                    btnPrintInvoice.classList.remove('d-none');
                    btnPrintInvoice.addEventListener('click',()=>{

                        //add a code to generate a new payment receipt here
                        let addedPayment = ajaxGetRequest("Payment/getPaymentsByRegistrationID/"+currentRegistration.id);
                        addedPayment = addedPayment[0];
                        generateInvoice(addedPayment);
                        setTimeout(function (){
                            next5();
                        },250)

                    })


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
    if(newPayment.amount>currentRegistration.balanceAmount){
        errors = errors +'The Current amount <span class="text-steam-green">Rs. '+newPayment.amount+ '.00</span> exceeds the total outstanding balance <span class="text-steam-green">Rs. '+registration.balanceAmount+'.00</span><br>';
    }
    return errors;
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