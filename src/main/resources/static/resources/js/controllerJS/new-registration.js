window.addEventListener("load",()=>{
    //reset the registration object
    registration = {};
    //get all the courses from the database using ajaxGetRequest function and store it in global courses variable
    courses =  ajaxGetRequest("/Course/findall");
    //using the function createCourseRadioCards to create cards for each course
    createCourseRadioCards(courses,handleCourseCardClick,testA);
    //reset student form
    resetStudentForm();
    //reset payment form
    resetPaymentForm();

    //validation chosen select (for new student)
    //add class select-validated when chosen select change an option
    $("#studentIdOption").chosen().change(function () {
        $("#studentIdOption_chosen .chosen-single").addClass('select-validated');
    });$("#studentLang").chosen().change(function () {
        $("#studentLang_chosen .chosen-single").addClass('select-validated');
    });$("#studentGuardianRelationship").chosen().change(function () {
        $("#studentGuardianRelationship_chosen .chosen-single").addClass('select-validated');
    });
    //validation chosen select (for payment)
    $("#paymentMethod").chosen().change(function () {
        $("#paymentMethod_chosen .chosen-single").addClass('select-validated');
    });

});


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

//creating a function to go to step 1 in the registration process
let next0 = () => {
    //check if the course is selected
    if(registration.courseID !=null) {
        //this means course is selected
        console.log(registration);
        //show footer_2 and hide footer_1
        footer_1.classList.remove('show');
        footer_2.classList.add('show');
        //show step1 as completed
        step1.classList.add('custom-step-complete');
        //change the step number to a tick
        document.querySelector('#btn-course .step-number span').innerText = '✔';

        //get all the active weekday batches for the selected course and store it in weekDayBatches variable
        weekDayBatches = ajaxGetRequest("/Batch/getActiveWeekDayBatch/"+registration.courseID.id);
        //get all the active weekend batches for the selected course and store it in weekEndBatches variable
        weekEndBatches = ajaxGetRequest("/Batch/getActiveWeekEndBatch/"+registration.courseID.id);
        //create radio cards for each batch using createBatchRadioCards function
        createBatchRadioCards(weekDayBatches,handleBatchCardClick,containerA);
        createBatchRadioCards(weekEndBatches,handleBatchCardClick,containerB);
        //check if there are no active weekend batches for the selected course
        if(weekEndBatches.length===0){
            //this means there are no active weekend batches
            //show a message to the user
            containerB.innerHTML = '<p class="text-red text-center small">No Active Weekend Batches Available! <br>Please Contact <strong>'+registration.courseID.name+'</strong> Course Coordinator</p>';
        }
        //check if there are no active weekday batches for the selected course
        if(weekDayBatches.length===0){
            //this means there are no active weekday batches
            //show a message to the user
            containerA.innerHTML = '<p class="text-red text-center small">No Active Weekday Batches Available! <br>Please Contact <strong>'+registration.courseID.name+'</strong> Course Coordinator</p>';
        }
    }
    else{
        //this means course is not selected
        //show a warning message to the user using external function showCustomModal
        showCustomModal("Please Select a Course !","warning");
    }

}
//creating a function to go to step 2 in the registration process
let next1 = () => {
    //check if the batch is selected
    if(registration.batchID !=null) {
        //this means batch is selected
        console.log(registration);
        //show footer_3 and hide footer_2
        footer_2.classList.remove('show');
        footer_3.classList.add('show');
        //show step2 as completed
        step2.classList.add('custom-step-complete');
        //change the step number to a tick
        document.querySelector('#btn-batch .step-number span').innerText = '✔';

        //check the standard 0% discount radio
        radioStandardFullPayment.checked = true;
        //set the isFullPayment to true
        registration.isFullPayment = true;

    }
    else{
        //this means batch is not selected
        //show a warning message to the user using external function showCustomModal
        showCustomModal("Please Select a Batch !","warning");
    }
}
//creating a function to go to step 3 in the registration process
let next2 = () => {
    //hide the footer_3 and show the footer_4
    footer_3.classList.remove('show');
    footer_4.classList.add('show');
    //show step3 as completed
    step3.classList.add('custom-step-complete');
    //change the step number to a tick
    document.querySelector('#btn-payment-str .step-number span').innerText = '✔';
    //enable the add new student and search student buttons
    document.getElementById('btn-new-student').classList.remove('disabled');
    document.getElementById('btn-search-student').classList.remove('disabled');

    console.log(registration);

}
//creating a function to go to step 4 in the registration process
let next3= ()=>{
    //creating a variable to store the result of the registration
    let isRegistrationSuccess ;
    //check if the student is selected
    if (registration.studentID != null) {
        //this means student is selected
        //get a user confirmation using external showCustomConfirm function
        showCustomConfirm("You are about to add a New Registration to the batch <span class='text-steam-green'>"+registration.batchID.batchCode+"</span><br><br>Are You Sure?", function (result) {
        //check the user confirmation
            if (result) {
                //this means user confirmation is "yes"
                //check if the registration is full payment
                if (registration.isFullPayment) {
                    //this means registration is full payment
                    //save the registration to the database using ajaxHttpRequest function by send a POST request to the backend
                    //get the response from the backend using ajaxHttpRequest function and store it in sever variable
                    const server = ajaxHttpRequest("/Registration", "POST", registration)
                    //check the response from the backend
                    if (server === "OK") {
                        //this means registration successfully added
                        //show a success message to the user using external showCustomModal function
                        showCustomModal("Registration Successfully Added!","success");
                        //set the isRegistrationSuccess to true
                        isRegistrationSuccess = true;

                    } else {
                        //this means there was a problem with the query
                        //show an error message to the user using external showCustomModal function
                        showCustomModal("Operation Failed! <br>" + server , "error");
                        //set the isRegistrationSuccess to false
                        isRegistrationSuccess = false;
                    }
                } else {
                    //this means registration is installment payment
                    //save the installment Plan to the database using ajaxHttpRequest function by send a POST request to the backend
                    //get the response from the backend using ajaxHttpRequest function and store it in severResult variable
                    const serverResult = ajaxHttpRequest("/InstallmentPlan", "POST", installmentPlan);
                    //check the response from the backend
                    if (serverResult === "OK") {
                        //this means installment plan successfully added
                        //show a success message to the user using external showCustomModal function
                        showCustomModal("Registration Successfully Added!","success");
                        //set the isRegistrationSuccess to true
                        isRegistrationSuccess = true;

                    } else {
                        //this means there was a problem with the query
                        //show an error message to the user using external showCustomModal function
                        showCustomModal("Operation Failed! <br>" + serverResult , "error");
                        //set the isRegistrationSuccess to false
                        isRegistrationSuccess = false;
                    }
                }

            //check the isRegistrationSuccess variable
            if(isRegistrationSuccess){
                //this means registration is successful
                //hide the footer_4 and show the footer_5
                footer_4.classList.remove('show');
                footer_5.classList.add('show');
                //show step4 as completed
                step4.classList.add('custom-step-complete');
                //change the step number to a tick
                document.querySelector('#btn-student .step-number span').innerText = '✔';
            }


        }
        else{
            //this means user confirmation is "no"
            // show a info message to the user using external showCustomModal function
            showCustomModal("Operation Cancelled!", "info");
        }
    });

    } else {
        //this means student is not selected
        //show a warning message to the user using external function showCustomModal
        showCustomModal("Please Select a Student or Add a New Student!", "warning");
    }

    //setting payment breakdown table info
    newPaymentCourseFee.innerText = "Rs. "+registration.batchID.paymentPlanID.courseFee.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
    newPaymentTabRegFee.innerText = "Rs. "+registration.batchID.paymentPlanID.registrationFee.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
    //check if the discount is undefined
    if(registration.discountAmount===undefined){
        //this means discount is undefined
        //set the discount amount to 0
        registration.discountAmount = 0;
    }
    //set payment info
    newPaymentTabDiscounts.innerText = "- Rs. "+registration.discountAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
    newPaymentTotalFee.innerText = "Rs. "+registration.fullAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});

}
//creating a function to go to step 5 in the registration process
let next4= ()=>{
    //hide the footer_5 and show the footer_6
    step5.classList.add('custom-step-complete');
    //change the step number to a tick
    document.querySelector('#btn-add-payment .step-number span').innerText = '✔';
}
//creating a function to go to step 6 in the registration process
let next5 = ()=>{
    //show step6 as completed
    step6.classList.add('custom-step-complete');
    //change the step number to a tick
    document.querySelector('#btn-complete .step-number span').innerText = '✔';
    //hide the footer_5 and show the footer_6
    footer_5.classList.remove('show');
    footer_6.classList.add('show');
}

//creating a function to go back to step1 in the registration process
let previous0 = () => {
    //show footer_1 and hide footer_2
    footer_1.classList.add('show');
    footer_2.classList.remove('show');
    //remove the custom-step-complete class from step1
    step1.classList.remove('custom-step-complete');
    //change the step number to 1
    document.querySelector('#btn-course .step-number span').innerText = '1';

    //set batchID to null
    registration.batchID = null;

}
//creating a function to go back to step2 in the registration process
let previous1 = () => {
    //check if the course is selected
    if(registration.courseID!==undefined) {
        //show footer_2 and hide footer_3
        footer_2.classList.add('show');
        footer_3.classList.remove('show');
        //remove the custom-step-complete class from step2
        step2.classList.remove('custom-step-complete');
        //change the step number to 2
        document.querySelector('#btn-batch .step-number span').innerText = '2';
    }
    else{
        //this means course is not selected
        //show a warning message to the user using external function showCustomModal
        showCustomModal("Please Complete The Previous Step !","warning");

    }



}
//creating a function to go back to step3 in the registration process
let previous2 = () => {
    //check if the batch or course is selected
    if(registration.courseID!==undefined || registration.batchID!==undefined) {
        //show footer_3 and hide footer_4
        footer_3.classList.add('show');
        footer_4.classList.remove('show');
        //remove the custom-step-complete class from step3
        step3.classList.remove('custom-step-complete');
        //change the step number to 3
        document.querySelector('#btn-payment-str .step-number span').innerText = '3';

    }
    else{
        //this means course or batch is not selected
        //show a warning message to the user using external function showCustomModal
        showCustomModal("Please Complete The Previous Step !","warning");

    }


}

//creating a function to calculate the discount amount when ever needed
//This function has five arguments
//1) elementID -> ID of the radio button
//2) totalFee -> total course fee
//3) registrationFee -> registration fee
//4) courseFee -> course fee
//5) discount -> discount amount in percentage(with out % icon)
//example -> calculateDiscount(testElement,50000,3000,47000,10)
const calculateDiscount = (elementID,totalFee,registrationFee,courseFee,discount)=>{
    //check if the radio button is checked
    if(elementID.checked){
        //this means radio button is checked
        //calculate the discount amount based on parameters and save it in discountReceived variable
        //discount percentage is only applied to the course fee
        discountReceived = (courseFee * (discount)/100);
        //calculate the final course fee by subtracting the discount amount from the course fee and save it in finalCourseFee variable
        finalCourseFee = (courseFee - discountReceived);
        //calculate the final total fee by adding the registration fee to the final course fee and save it in finalTotalFee variable
        finalTotalFee =  finalCourseFee + registrationFee;

        //since discount are only available for the full payment type registrations
        //set the isFullPayment to true
        registration.isFullPayment = true;
        //set the oneTimePaymentAmount to the finalTotalFee
        registration.oneTimePaymentAmount = finalTotalFee;
        //set the discountRate to the discount
        registration.discountRate = discount;
        //set the discountAmount to the discountReceived
        registration.discountAmount = discountReceived;
        //set the fullAmount to the finalTotalFee
        registration.fullAmount = finalTotalFee;
        //since this is a new registration no payments are done yet. so set the paidAmount to 0
        registration.paidAmount = 0;
        //set the balanceAmount to the finalTotalFee
        registration.balanceAmount = finalTotalFee;

        //display the discount amount in the lblDiscountFeeHeading element using innerHTML
        lblDiscountFeeHeading.innerHTML = "Discount "+discount+"% Off";
        //display the discount amount in the lblDiscountFee element using innerHTML
        //format the discount amount, registration fee, course fee, discount received, final total fee to currency type using toLocaleString function
        //display the registration fee in the txtRegistrationFeeFullPayment element using innerHTML
        txtRegistrationFeeFullPayment.innerHTML = "Rs. "+ registrationFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        //display the course fee in the txtCourseFeeFullPayment element using innerHTML
        txtCourseFeeFullPayment.innerHTML = "Rs. "+ courseFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        //display the discount received in the txtTotalDiscountFeeFullPayment element using innerHTML
        txtTotalDiscountFeeFullPayment.innerHTML = "- Rs. "+discountReceived.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        //display the final total fee in the txtTotalFeeFullPayment element using innerHTML
        txtTotalFeeFullPayment.innerHTML = "Rs. "+ finalTotalFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

}

//creating function to load the fee for the selected batch
//this function has five arguments
//1) ob -> the selected batch object
//2) totalFeeInputID -> the element ID to display the total fee
//3) registrationFeeInputID -> the element ID to display the registration fee
//4) courseFeeInputID -> the element ID to display the course fee
//5) isFullPayment -> boolean value to check if the registration is full payment or installment payment
//example -> loadFee(testObject,txtTotalFeeFullPayment,txtRegistrationFeeFullPayment,txtCourseFeeFullPayment,true)
const loadFee = (ob,totalFeeInputID,registrationFeeInputID,courseFeeInputID,isFullPayment)=>{
    //display the total fee, registration fee, course fee in the respective elements using innerHTML
    //format the total fee, registration fee, course fee to currency type using toLocaleString function
    totalFeeInputID.innerHTML = "Rs. "+(ob.paymentPlanID.totalFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    registrationFeeInputID.innerHTML = "Rs. "+(ob.paymentPlanID.registrationFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    courseFeeInputID.innerHTML = "Rs. "+(ob.paymentPlanID.courseFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    //reset the tbody of tblInstallments table using innerHTML
    tblInstallments.children[1].innerHTML = '';

    //check if the registration is full payment
    if(isFullPayment) {
        //this means registration is full payment
        //set the discount amount to 0
        txtTotalDiscountFeeFullPayment.innerHTML = "-Rs. 0.00";
        //set the oneTimePaymentAmount to object total fee
        registration.oneTimePaymentAmount = ob.paymentPlanID.totalFee;
        //set the fullAmount to object total fee
        registration.fullAmount = ob.paymentPlanID.totalFee;
        //since this is a new registration no payments are done yet. so set the paidAmount to 0
        registration.paidAmount = 0;
        //set the balanceAmount to object total fee
        registration.balanceAmount = ob.paymentPlanID.totalFee;

    }
}

//creating a function to calculate the installment plan
//this function has five arguments
//1) elementID -> ID of the radio button
//2) totalFee -> total course fee
//3) registrationFee -> registration fee
//4) courseFee -> course fee
//5) installments -> number of installments
//example -> calculateInstallments(testElement,50000,3000,47000,8)
const calculateInstallments =(elementID,totalFee,registrationFee,courseFee,installments)=>{
    //check if the radio button is checked
    if(elementID.checked){
        //this means radio button is checked
        //reset the installmentPlan array
        installmentPlan=[];
        //set the isFullPayment to false
        registration.isFullPayment = false;
        //set the oneTimePaymentAmount to null
        registration.oneTimePaymentAmount =null;
        //set the fullAmount to totalFee
        registration.fullAmount = totalFee;
        //since this is a new registration no payments are done yet. so set the paidAmount to 0
        registration.paidAmount = 0;
        //set the balanceAmount to totalFee
        registration.balanceAmount = totalFee;
        //this is an installment payment so set the discountRate to 0
        registration.discountRate = 0;
        //this is an installment payment so set the discountAmount to 0
        registration.discountAmount = 0;

        //show the installment plan table
        tblInstallments.classList.remove('d-none');
        //calculate the installment fee by dividing the course fee by the number of installments and save it in installmentFee variable
        const installmentFee = courseFee / installments;
        //get the current date form Date function and save it in currentDate variable
        let currentDate = new Date();

        //get the tbody from the installment plan table and save it in tbody variable
        const tbody = tblInstallments.children[1];
        //clear the table body
        tbody.innerHTML = '';

        //Display the first installment start
        //create a new table row and save it in firstTR variable
        const firstTR = document.createElement('tr');
        //create a new table data and save it in firstTD variable
        const firstTD = document.createElement('td');
        //set the inner text of the firstTD to 1
        firstTD.innerText = "1";
        //append the firstTD to the firstTR
        firstTR.appendChild(firstTD);
        //create a new table data and save it in secondTD variable
        const secondTD = document.createElement('td');
        //set the inner text of the secondTD to the installment fee plus the registration fee
        //format the total amount to currency type using toLocaleString function
        //first installment should cover the registration fee
        //only the course fee is divided equally among the installments
        secondTD.innerText = (installmentFee + registrationFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        //append the secondTD to the firstTR
        firstTR.appendChild(secondTD);
        //create a new table data and save it in thirdTD variable
        const thirdTD = document.createElement('td');
        //set the inner text of the thirdTD to the current date in ISO format
        //slice the date to get only the date part
        //since this a new registration first installment due date is set to current date
        thirdTD.innerText = currentDate.toISOString().slice(0, 10);
        //append the thirdTD to the firstTR
        firstTR.appendChild(thirdTD);
        //append the firstTR to the tbody
        tbody.appendChild(firstTR);
        //Display the first installment end

        //set the installment number to 1
        //set the payment to the installment fee plus the registration fee
        //set the paid amount to 0 since this is a new registration
        //set the balance amount to the installment fee plus the registration fee
        //set the due date to the current date
        //set the status to "Not Paid" since this is a new registration
        //set the registration ID to the current registration
        //push the first installment to the installmentPlan array
        installmentPlan.push({ installmentNumber: 1, payment: (installmentFee + registrationFee),paidAmount:0,balanceAmount:(installmentFee + registrationFee),dueDate: currentDate.toISOString().slice(0, 10),status:"Not Paid",registrationID:registration});

        //generate the rest of the installments by using a for loop
        //start the loop from 1 since the first installment is already displayed
        //end the loop at the number of installments
        for (let i = 1; i < installments; i++) {
            //get the next month date from the current date and save it in newDate variable
            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
            //create a new table row and save it in tr variable
            const tr = document.createElement('tr');
            //create a new table data and save it in installmentTD variable
            const installmentTD = document.createElement('td');
            //set the inner text of the installmentTD to the installment number
            installmentTD.innerText = i + 1;
            //append the installmentTD to the tr
            tr.appendChild(installmentTD);
            //create a new table data and save it in installmentAmountTD variable
            const installmentAmountTD = document.createElement('td');
            //set the inner text of the installmentAmountTD to the installment fee
            //format the installment fee to currency type using toLocaleString function
            installmentAmountTD.innerText = (installmentFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            //append the installmentAmountTD to the tr
            tr.appendChild(installmentAmountTD);
            //create a new table data and save it in installmentDateTD variable
            const installmentDateTD = document.createElement('td');
            //set the inner text of the installmentDateTD to the new date in ISO format
            installmentDateTD.innerText = newDate.toISOString().slice(0, 10);
            //append the installmentDateTD to the tr
            tr.appendChild(installmentDateTD);
            // Update currentDate for the next iteration
            currentDate = newDate;
            //append the tr to the tbody
            tbody.appendChild(tr);
            //set the installment number to i+1
            //set the payment to the installment fee
            //set the paid amount to 0 since this is a new registration
            //set the balance amount to the installment fee
            //set the due date to the new date
            //set the status to "Not Paid" since this is a new registration
            //set the registration ID to the current registration
            //push the installment to the installmentPlan array
            installmentPlan.push({ installmentNumber: i+1, payment: installmentFee,paidAmount:0,balanceAmount:installmentFee,dueDate: newDate.toISOString().slice(0, 10),status:"Not Paid",registrationID:registration});
        }

    }

}

//creating a function to handle to batch card click
const handleBatchCardClick = (object, index) => {
    console.log(object);
    //set the batchID to the selected batch object
    registration.batchID = object;
    //load fee for full payment using loadFee function
    loadFee(object,txtTotalFeeFullPayment,txtRegistrationFeeFullPayment,txtCourseFeeFullPayment,true);
    //load fee for installment payment using loadFee function
    loadFee(object,txtTotalFeePartPayment,txtRegistrationFeePartPayment,txtCourseFeePartPayment,false);
};

//creating a function to handle the course card click
const handleCourseCardClick = (object , index)=>{
    console.log(object);
    //set the courseID to the selected course object
    registration.courseID = object;
}

//creating a function to reset the student form when ever needed
const resetStudentForm = ()=>{
    //reset the form
    frmNewStudent.reset();
    //remove select-validated class from chosen select
    $("#studentIdOption_chosen .chosen-single").removeClass('select-validated');
    $("#studentLang_chosen .chosen-single").removeClass('select-validated');
    $("#studentGuardianRelationship_chosen .chosen-single").removeClass('select-validated');
    //remove is-valid class from the studentIdOption Element
    studentIdOption.classList.remove('is-valid');
    //remove is-valid class from the studentLang Element
    studentLang.classList.remove('is-valid');
    //remove is-valid class from the studentGuardianRelationship Element
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
        //reset the inline css from input
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //initialize chosen select
    $("#studentLang").chosen({width: '100%', disable_search: true});
    $("#studentIdOption").chosen({width: '100%', disable_search: true});
    $("#studentGuardianRelationship").chosen({width: '100%', disable_search: true});
    //initialize daterangepicker
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
    //bind data to the student object, once the "apply" button on studentDOB input is clicked
    $('#studentDOB').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        //using inputTextValidator function to validate the input
        inputTextValidator(this, '^(19[89][0-9]|20[0-9]{2})[-][0-9]{2}[-][0-9]{2}$', 'newStudent', 'dob');

    });

}

//creating a function to automatically to select the gender once the radio button is clicked
const automateGender = ()=>{
    //check if the studentMr radio button is checked
    if(studentMr.checked){
        //this means studentMr radio button is checked
        //set the radioGender to false
        radioGender.checked = false;
        //validate the radioGender using checkBoxValidator function
        checkBoxValidator(radioGender, leftMale, rightFemale, 'newStudent', 'gender', 'Female', 'Male');

    }
    //check if the studentMs radio button or studentMrs radio button is checked
    if(studentMs.checked || studentMrs.checked){
        //this means studentMs radio button or studentMrs radio button is checked
        //set the radioGender to true
        radioGender.checked =true;
        //validate the radioGender using checkBoxValidator function
        checkBoxValidator(radioGender, leftMale, rightFemale, 'newStudent', 'gender', 'Female', 'Male');
    }
}

//creating a function to automate the name with initials when the full name is entered
const automateInitials = ()=>{
    //split the full name by space and save it in fullname variable
    let fullname = studentFullName.value.split(" ");
    //create a variable to store the initials name and set it to empty
    let initialsName = '';
    //loop through the fullname array
    fullname.forEach((word, index) => {
        //check if the index is less than the length of the fullname array
        if (index < fullname.length - 1) {
            //this means the index is less than the length of the fullname array
            //add the first letter of the word and a dot to the initialsName variable
            //this will create the initials name
            initialsName += word[0] + ".";

        }
        else{
            //this means the index is equal to the length of the fullname array
            //add the word to the initialsName variable
            //this will add the last name to the initials name
            initialsName += word;
        }
    });
    //display the initials name in the studentNameWithInitials input
    studentNameWithInitials.value=initialsName;
    //validate the studentNameWithInitials input using inputTextValidator function
    inputTextValidator(studentNameWithInitials,'^[A-Z][.][A-Z][.][A-Z][.][A-Z][a-z]{5,}$','newStudent','nameWithInitials')

}

//creating a function to submit the student form when ever needed
const newStudentSubmit = ()=>{
    console.log(newStudent);
    //calling the checkStudentFormErrors function and catching the return value to errors variable
    let errors = checkStudentFormErrors();
    //check if the errors variable is empty
    if(errors === '')
    {
        //this means there are no errors
        //get a user confirmation using external showCustomConfirm function
        showCustomConfirm("You are about to add a New Student<br>Are You Sure?", function (result) {
            //check the user confirmation
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

                    //attach the student Object to the registration(this wont work need to request it from database again)
                    registration.studentID = newStudent;
                    //ajaxGetRequest("/Student/getStudentByIdValue/"+newStudent.idValue);

                    //refresh the form
                    resetStudentForm();

                    //disable the add new student btn
                    document.getElementById('btn-new-student').classList.add('disabled');
                    //disable the search student btn
                    document.getElementById('btn-search-student').classList.add('disabled');

                } else {
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed! <br>" + serviceResponse , "error");
                }
            }

            else {
                //will execute this block if the user confirmation is "no"
                //show user an alert
                showCustomModal("Operation Cancelled!", "info");
            }

        });
    }
    else{
        //this means there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');
    }

}

//creating a function to search for a student
const searchStudent=()=>{
    //get the search text from the studentSearchID input and save it in searchText variable
    const searchText = studentSearchID.value;
    //get the student from the database using ajaxGetRequest function and store it in responseStudent global variable
    responseStudent = ajaxGetRequest("/Student/getStudentsByNicOrStudentNumberOrMobileNumber/"+searchText);
    console.log(responseStudent);
    //create radio cards for student using createStudentRadioCards function
    createStudentRadioCards(responseStudent,handleStudentCardClick,existStudentResults);
}

//creating a function to handle to student card click
const handleStudentCardClick=(object)=>{
    //set the studentID to the selected student object
    registration.studentID = object;

}

//creating a reusable function to check all the required inputs are filled by checking bound values
//this function will return if there are any unfilled inputs and unbind data
const checkStudentFormErrors = () => {
    //creating a variable to store the errors and set it to empty
    let errors = '';
    //check if title is null
    if(newStudent.title==null){
        errors = errors + 'Title is Required<br>';
    }
    //check if fullname is null
    if(newStudent.fullName==null){
        errors = errors + 'Full Name is Required<br>';
    }
    //check if nameWithInitials is null
    if(newStudent.nameWithInitials==null){
        errors = errors + 'Name With Initials is Required<br>';
    }
    //check if gender is null
    if(newStudent.gender==null){
        errors = errors + 'Gender is Required<br>';
    }
    //check if dob is null
    if(newStudent.dob==null){
        errors = errors + 'DOB is Required<br>';
    }
    //check if language is null
    if(newStudent.language==null){
        errors = errors + 'Language is Required<br>';
    }
    //check if mobileNumber is null
    if(newStudent.mobileNumber==null){
        errors = errors + 'Mobile Number is Required<br>';
    }
    //check if addressLine1 is null
    if(newStudent.addressLine1==null){
        errors = errors + 'Address Line 1 is Required<br>';
    }
    //check if city is null
    if(newStudent.city==null){
        errors = errors + 'City is Required<br>';
    }
    //check if idType is null
    if(newStudent.idType==null){
        errors = errors + 'ID Type is Required<br>';
    }
    //check if idValue is null
    if(newStudent.idValue==null){
        errors = errors + 'ID Value is Required<br>';
    }
    //check if guardianName is null
    if(newStudent.guardianName==null){
        errors = errors + 'Guardian Name is Required<br>';
    }
    //check if guardianRelationship is null
    if(newStudent.guardianRelationship==null){
        errors = errors + 'Guardian Relationship is Required<br>';
    }
    //check if guardianContactNumber is null
    if(newStudent.guardianContactNumber==null){
        errors = errors + 'Guardian Contact Number is Required<br>';
    }

    //return the errors
    return errors;
}

//creating a function to reset the payment form when ever needed
const resetPaymentForm = ()=>{
    //remove the select-validated class from the paymentMethod chosen select
    $("#paymentMethod_chosen .chosen-single").removeClass('select-validated');
    //remove the is-valid class from the paymentMethod Element
    paymentMethod.classList.remove('is-valid');
    //reset the payment object
    newPayment = {};
    //reset the form
    frmAddNewPayment.reset();
    //set default option chosen
    setTimeout(function () {
        $('#paymentMethod').val('').trigger('chosen:updated');
    }, 0);

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newRegistrationPaymentInputs');
    inputs.forEach(function (input) {
        //reset the inline css from input
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //get all the payment methods from the database using ajaxGetRequest function and save it in paymentMethods variable
    const paymentMethods = ajaxGetRequest('/PaymentType/findall');
    //fill the paymentMethod select options using fillSelectOptions function
    fillSelectOptions(paymentMethod,' ',paymentMethods,'name')
    //initialize chosen select
    $('#paymentMethod').chosen({width: '100%'});


}

//creating a function to submit the payment form when ever needed
const newPaymentSubmit=()=>{
    //get the current registration from the database using ajaxGetRequest function and save it in currentRegistration variable
    currentRegistration = ajaxGetRequest("/Registration/getRegistrationFromBatchAndStudentNIC/"+registration.batchID.id+"/"+registration.studentID.idValue);
    //bind the registration to the new payment
    newPayment.registrationID =currentRegistration;
    //calling the checkPaymentFormErrors function and catching the return value to errors variable
    let errors = checkPaymentFormErrors();
    //check if the errors variable is empty
    if(errors==='') {
        //this means there are no errors
        //get a user confirmation using external showCustomConfirm function
        //display the payment amount in currency format using toLocaleString function
        showCustomConfirm("You are about to add a New Payment of <br><span class='text-steam-green'>Rs. " + parseFloat(newPayment.amount).toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }) + "</span> To this registration <br><br>Are You Sure?", function (result) {
            //check the user confirmation
            if (result) {
                //this means user confirmation is "yes"
                //save the new payment to the database using ajaxHttpRequest function by send a POST request to the backend
                //get the response from the backend using ajaxHttpRequest function and store it in severResponse variable
                let serviceResponse = ajaxHttpRequest("/Payment", 'POST', newPayment);
                //check the serviceResponse value is "OK"
                if (serviceResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user using external showCustomModal function
                    showCustomModal("Payment Successfully Added!", "success");
                    //refresh the form using resetPaymentForm function
                    resetPaymentForm();
                    //call the next4 function to go to step 4 in the registration process
                    next4();
                    //show the print invoice button
                    btnPrintInvoice.classList.remove('d-none');
                    //add an event listener to the print invoice button
                    //when the button is clicked generate a new payment receipt
                    btnPrintInvoice.addEventListener('click',()=>{
                        //get the all added payments from the database using ajaxGetRequest function and save it in addedPayment variable
                        let addedPayment = ajaxGetRequest("Payment/getPaymentsByRegistrationID/"+currentRegistration.id);
                        //get the first added payment from the addedPayment array and save it in addedPayment variable
                        //since there is only one payment for a registration
                        addedPayment = addedPayment[0];
                        //generate the invoice using generateInvoice function
                        generateInvoice(addedPayment);
                        //print the invoice
                        setTimeout(function (){
                            //call the next5 function to go to step 5 in the registration process after 250ms
                            next5();
                        },250)

                    })


                } else {
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed! <br>" + serviceResponse, "error");
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