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

    $("#studentIdOption").chosen().change(function () {
        $("#studentIdOption_chosen .chosen-single").addClass('select-validated');
    });$("#studentLang").chosen().change(function () {
        $("#studentLang_chosen .chosen-single").addClass('select-validated');
    });$("#studentGuardianRelationship").chosen().change(function () {
        $("#studentGuardianRelationship_chosen .chosen-single").addClass('select-validated');
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

//get all the footers
let footer_1 = document.querySelector('#step-course');
let footer_2 = document.querySelector('#step-batch');
let footer_3 = document.querySelector('#step-payment-str');
let footer_4 = document.querySelector('#step-student');
let footer_5 = document.querySelector('#step-add-payment');

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

    console.log(registration);

}

let next3= ()=>{

    showCustomConfirm("You are about to add a New Registration<br>Are You Sure?", function (result) {
        if (result) {
            if (registration.studentID != null) {
                footer_4.classList.remove('show');
                footer_5.classList.add('show');
                step4.classList.add('custom-step-complete');
                document.querySelector('#btn-student .step-number span').innerText = '✔';

                //unfinished code start
                if (registration.isFullPayment) {
                    const server = ajaxHttpRequest("/Registration", "POST", registration)
                    if (server === "OK") {

                        alert("ela")
                    } else {
                        alert(server)
                    }
                } else {
                    alert("This is a part payment")
                    const serverResult = ajaxHttpRequest("/InstallmentPlan", "POST", installmentPlan)
                }
                //unfinished code end

            } else {
                showCustomModal("Please Select a Student !", "warning");
            }
        }
        else{
            showCustomModal("Operation Cancelled!", "info");
        }
    });

}
let next4= ()=>{
    step5.classList.add('custom-step-complete');
    document.querySelector('#btn-add-payment .step-number span').innerText = '✔';

    //add print receipt logic here
}
let previous0 = () => {
    step1.classList.remove('custom-step-complete');
    step2.classList.remove('custom-step-complete');
    step3.classList.remove('custom-step-complete');
    step4.classList.remove('custom-step-complete');
    step5.classList.remove('custom-step-complete');

    footer_1.classList.add('show');
    footer_2.classList.remove('show');
    footer_3.classList.remove('show');
    footer_4.classList.remove('show');
    footer_5.classList.remove('show');

    document.querySelector('#btn-course .step-number span').innerText = '1';
    document.querySelector('#btn-batch .step-number span').innerText = '2';
    document.querySelector('#btn-payment-str .step-number span').innerText = '3';
    document.querySelector('#btn-student .step-number span').innerText = '4';
    document.querySelector('#btn-add-payment .step-number span').innerText = '5';

    //all the values should be null expect the course
    registration.batchID = null;

}
let previous1 = () => {
    if(registration.courseID!==undefined) {
        //footer_1 value should be present in order to execute the following code -> use if
        step2.classList.remove('custom-step-complete');
        step3.classList.remove('custom-step-complete');
        step4.classList.remove('custom-step-complete');
        step5.classList.remove('custom-step-complete');


        footer_1.classList.remove('show');
        footer_2.classList.add('show');
        footer_3.classList.remove('show');
        footer_4.classList.remove('show');
        footer_5.classList.remove('show');

        document.querySelector('#btn-batch .step-number span').innerText = '2';
        document.querySelector('#btn-payment-str .step-number span').innerText = '3';
        document.querySelector('#btn-student .step-number span').innerText = '4';
        document.querySelector('#btn-add-payment .step-number span').innerText = '5';
    }
    else{
        showCustomModal("Please Complete The Previous Step !","warning");

    }



}
let previous2 = () => {
    if(registration.courseID!==undefined || registration.batchID!==undefined) {
        step3.classList.remove('custom-step-complete');
        step4.classList.remove('custom-step-complete');
        step5.classList.remove('custom-step-complete');


        footer_1.classList.remove('show');
        footer_2.classList.remove('show');
        footer_3.classList.add('show');
        footer_4.classList.remove('show');
        footer_5.classList.remove('show');

        document.querySelector('#btn-payment-str .step-number span').innerText = '3';
        document.querySelector('#btn-student .step-number span').innerText = '4';
        document.querySelector('#btn-add-payment .step-number span').innerText = '5';
    }
    else{
        showCustomModal("Please Complete The Previous Step !","warning");

    }


}
let previous3 = () =>{
    if(registration.courseID!==undefined || registration.batchID!==undefined) {
        step4.classList.remove('custom-step-complete');
        step5.classList.remove('custom-step-complete');


        footer_1.classList.remove('show');
        footer_2.classList.remove('show');
        footer_3.classList.remove('show');
        footer_4.classList.add('show');
        footer_5.classList.remove('show');

        document.querySelector('#btn-student .step-number span').innerText = '4';
        document.querySelector('#btn-add-payment .step-number span').innerText = '5';
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

// radioCashDiscountFullPayment.addEventListener('change',()=>{
//     if(radioCashDiscountFullPayment.checked) {
//         let remainFee = parseFloat(txtRemainingFeeFullPayment.value).toFixed(2);
//         let discountFee = parseFloat((remainFee*10)/100).toFixed(2);
//         let finalFee = parseFloat((remainFee * 90) / 100).toFixed(2);
//         let registrationFee = parseFloat(txtRegistrationFeeFullPayment.value).toFixed(2);
//         txtRemainingFeeFullPayment.value = finalFee;
//         txtDiscountedFeeFullPayment.value = discountFee;
//         txtFinalFeeFullPayment.value = (parseFloat(parseFloat(registrationFee) + parseFloat(finalFee)).toFixed(2));
//     }
//
//
// });

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
        inputTextValidator(this, '^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$', 'newStudent', 'dob');

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
                    showCustomModal("Student Successfully Added!", "success");
                    //close the student offcanvas
                    offCanvasStudentCloseButton.click();

                    //attach the student Objetc to the regitration(this wont work need to request it from database again)

                    registration.studentID = newStudent;
                    //ajaxGetRequest("/Student/getStudentByIdValue/"+newStudent.idValue);

                    //refresh the form
                    resetStudentForm();

                    //instead of reset the table newly added record should be added here or click the next button
                    //do the best one
                    next3();

                } else {
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed!" + serviceResponse, "error");
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