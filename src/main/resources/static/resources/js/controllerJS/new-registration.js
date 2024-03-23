window.addEventListener("load",()=>{

    registration = {};
    student ={};

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

    createCourseRadioCards(courses,handleBatchCardClick,testA);

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

}

let next3= ()=>{
    footer_4.classList.remove('show');
    footer_5.classList.add('show');
    step4.classList.add('custom-step-complete');
    document.querySelector('#btn-student .step-number span').innerText = '✔';


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
        showCustomModal("Please Select a Course !","warning");

    }



}
let previous2 = () => {
    if(registration.courseID!==undefined) {
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
        showCustomModal("Please Select a Batch !","warning");

    }


}
let previous3 = () =>{
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
        //set default fees (without discount calculation just as is)
        txtTotalFeeFullPayment.value = parseFloat(totalFee).toFixed(2);
        txtRegistrationFeeFullPayment.value = parseFloat(registrationFee).toFixed(2);
        txtCourseFeeFullPayment.value = parseFloat(courseFee).toFixed(2);

        //calculate discount amount and update relevant fields
        discountReceived = (courseFee * (discount)/100);
        finalCourseFee = (courseFee - discountReceived);
        finalTotalFee =  finalCourseFee + registrationFee;

        //display final amounts
        txtTotalDiscountFeeFullPayment.value = parseFloat(discountReceived).toFixed(2);
        txtFinalTotalFeeFullPayment.value = parseFloat(finalTotalFee).toFixed(2);
        txtFinalCourseFeeFullPayment.value = parseFloat(finalCourseFee).toFixed(2);
        txtFinalRegistrationFeeFullPayment.value = parseFloat(registrationFee).toFixed(2);

    }

}

const loadFee = (ob,totalFeeInputID,registrationFeeInputID,courseFeeInputID,isFullPayment)=>{
    totalFeeInputID.value = (ob.paymentPlanID.totalFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    registrationFeeInputID.value = (ob.paymentPlanID.registrationFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    courseFeeInputID.value = (ob.paymentPlanID.courseFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    tblInstallments.children[1].innerHTML = '';

    if(isFullPayment) {
        txtTotalDiscountFeeFullPayment.value = "0.00";
        txtFinalTotalFeeFullPayment.value = (ob.paymentPlanID.totalFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        txtFinalCourseFeeFullPayment.value = (ob.paymentPlanID.courseFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        txtFinalRegistrationFeeFullPayment.value = (ob.paymentPlanID.registrationFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }


}

const calculateInstallments =(elementID,totalFee,registrationFee,courseFee,installments)=>{
    if(elementID.checked){
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