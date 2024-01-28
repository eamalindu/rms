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

    fillDataIntoTableWithRadio(tblCourses,courses,displayPropertyListForCourse,radioFunction,'course');
    $('#tblCourses').DataTable();

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

        weekDayBatches = ajaxGetRequest("/Batch/getWeekDayBatch/"+registration.courseID.id);
        weekEndBatches = ajaxGetRequest("/Batch/getWeekEndBatch/"+registration.courseID.id);

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
        fillDataIntoTableWithRadio(tblWeekDayBatches,weekDayBatches,displayPropertyListForWeekDay,radioFunctionForWeekDay,'batch');
        fillDataIntoTableWithRadio(tblWeekEndBatches,weekEndBatches,displayPropertyListForWeekEnd,radioFunctionForWeekEnd,'batch');


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
let previous2 = () => {
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
    txtTotalFeeFullPayment.value = parseFloat(ob.totalFee).toFixed(2);
    txtRegistrationFeeFullPayment.value = parseFloat(ob.registrationFee).toFixed(2);
    txtRemainingFeeFullPayment.value =parseFloat(ob.remainingFee).toFixed(2);
    txtFinalFeeFullPayment.value = parseFloat(ob.remainingFee + ob.registrationFee).toFixed(2);
}

const radioFunctionForWeekEnd = (ob,index)=>{

    registration.batchID = ob;
    txtTotalFeeFullPayment.value = parseFloat(ob.totalFee).toFixed(2);
    txtRegistrationFeeFullPayment.value = parseFloat(ob.registrationFee).toFixed(2);
    txtRemainingFeeFullPayment.value =parseFloat(ob.remainingFee).toFixed(2);
    txtFinalFeeFullPayment.value = parseFloat(ob.remainingFee + ob.registrationFee).toFixed(2);

}

radioCashDiscountFullPayment.addEventListener('change',()=>{
    if(radioCashDiscountFullPayment.checked) {
        let remainFee = parseFloat(txtRemainingFeeFullPayment.value).toFixed(2);
        let finalFee = parseFloat((remainFee * 90) / 100).toFixed(2);
        let registrationFee = parseFloat(txtRegistrationFeeFullPayment.value).toFixed(2);
        txtRemainingFeeFullPayment.value = finalFee;
        txtFinalFeeFullPayment.value = (parseFloat(parseFloat(registrationFee) + parseFloat(finalFee)).toFixed(2));
    }


});