window.addEventListener("load",()=>{

    //reset the batch form
    resetBatchForm();
    //refresh the batch table
    refreshBatchTable();

    //validation chosen select (for new batch)
    $("#batchCourse").chosen().change(function () {
        $("#batchCourse_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchClassDay").chosen().change(function () {
        $("#batchClassDay_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchPaymentPlan").chosen().change(function () {
        $("#batchPaymentPlan_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchLectureRoom").chosen().change(function () {
        $("#batchLectureRoom_chosen .chosen-single").addClass('select-validated');
    });

    //bind data to the batch object, once the "apply" button on batchCommenceDate input is clicked
    $('#batchCommenceDate').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        //binding data to newBatch object
        inputTextValidator(this,'^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$','newBatch','commenceDate');
        //calling the calculateLastRegDate function to auto generated the last registration date according to the selected commence date
        calculateLastRegDate();
        //calling the calculateLastRegDate function to auto generated the batch end date according to the selected commence date
        calculateEndDate();
    });
});

//creating a function to refresh the batch table when ever needed
const refreshBatchTable =()=>{

    //getting current batches from the database using ajaxGetRequest function and assign the response to the variable batches
    batches = ajaxGetRequest("/Batch/findall");
    //creating a display property list for the batches
    displayPropertyListForBatches = [
        {property:getCourseName,dataType:'function'},
        {property:'batchCode',dataType:'text'},
        {property:'commenceDate',dataType:'text'},
        {property:'endDate',dataType:'text'},
        {property:getWeekDay,dataType:'function'},
        {property:'seatCount',dataType:'text'},
        {property:'description',dataType:'text'},
        {property:getStatus,dataType:'function'},
    ];

    fillDataIntoTable(tblBatch,batches,displayPropertyListForBatches,rowView,'offcanvasBatchSheet');

    $('#tblBatch').DataTable();
}

//since we cant access the Course Name from the batches directly. creating a function to return the Course Name from the batches object
const getCourseName = (ob)=>{
    return ob.courseID.name;
}

//since the isWeekday data type is in boolean we cant show true or false in the table
//creating a function to return Weekday and Not Weekday based on their value
const getWeekDay = (ob)=>{
    if(ob.isWeekday){
        return "Weekday";
    }
    else{
        return "Weekday";
    }

}

//since we cant access the Course Status from the batches directly. creating a function to return the Course Status from the batches object
const getStatus = (ob)=>{
    if(ob.batchStatusID.name==="Scheduled") {
        return '<span class="badge rounded-0" style="background: #3FB618">Scheduled</span>';
    }
    else if(ob.batchStatusID.name==="Started"){
        return '<span class="badge rounded-0" style="background: #ea8a1e">Started</span>';
    }
    else{
        return '<span class="badge rounded-0" style="background: #1eadea">Completed</span>';
    }
}

//created a function to show to details in an offcanvas
const rowView = (ob,index)=>{

    //hide the update btn
    btnBatchSheetUpdate.style.display = 'none';
    //add the attribute disabled to make inputs block the user input values
    //remove the edited border colors from the inputs
    inputs = document.querySelectorAll('.batchSheetInputs');
    inputs.forEach(function (input) {
        input.setAttribute('disabled', 'true');
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });
    //disable radio button
    batchSheetWeekday.disabled = true;
    //refill data
    batchSheetCode.innerText = ob.batchCode;
    batchSheetCreated.value = ob.createdBy;
    batchSheetCommenceDate.value = ob.commenceDate;
    batchSheetEndDate.value = ob.endDate;
    batchSheetSeatCount.value = ob.seatCount;
    batchSheetLastDate.value = ob.lastRegDate;
    batchSheetDescription.value = ob.description;

    if(ob.batchStatusID.name==='Scheduled'){
        batchSheetCode.classList.add('text-success');
    }
    else if(ob.batchStatusID.name==='Started'){
        batchSheetCode.classList.add('text-warning');
    }
    else{
        batchSheetCode.classList.add('text-danger');
    }

    if(ob.isWeekday){
        batchSheetWeekday.checked = false;

    }
    else{
        batchSheetWeekday.checked = true;


    }

    paymentPlans = ajaxGetRequest("/PaymentPlan/getActivePlans/"+ob.courseID.id);
    batchStatus = ajaxGetRequest("/BatchStatus/findall");

    fillSelectOptions(batchSheetCourse, 'Please Select a Course', courses, 'name',ob.courseID.name)
    fillSelectOptions(batchSheetPaymentPlan, 'Please Select a Payment Plan',paymentPlans , 'name',ob.paymentPlanID.name)
    fillSelectOptions(batchSheetStatus, 'Please Select a Status', batchStatus, 'name',ob.batchStatusID.name)

    //fill payment plan table
    batchSheetPaymentPlanRegistrationFee.innerText =  "Rs. "+ob.paymentPlanID.registrationFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    batchSheetPaymentPlanCourseFee.innerText =  "Rs. "+ob.paymentPlanID.courseFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    batchSheetPaymentPlanTotalFee.innerText =  "Rs. "+ob.paymentPlanID.totalFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    batchSheetPaymentPlanInstallments.innerText = ob.paymentPlanID.numberOfInstallments;

}

//creating a function to reset the Batch form when ever needed
const resetBatchForm = ()=>{

    $("#batchCourse_chosen .chosen-single").removeClass('select-validated');
    $("#batchClassDay_chosen .chosen-single").removeClass('select-validated');
    $("#batchPaymentPlan_chosen .chosen-single").removeClass('select-validated');
    $("#batchLectureRoom_chosen .chosen-single").removeClass('select-validated');
    batchCourse.classList.remove('is-valid');
    batchClassDay.classList.remove('is-valid');
    batchPaymentPlan.classList.remove('is-valid');
    batchLectureRoom.classList.remove('is-valid');

    //reset batch object
    newBatch = {}

    //testing code for timetable
    newTimetable = [];

    frmNewBatch.reset();

    //set default option chosen
    setTimeout(function () {
        $('#batchCourse').val('').trigger('chosen:updated');
        $('#batchClassDay').val('').trigger('chosen:updated');
        $('#batchPaymentPlan').val('').trigger('chosen:updated');
        $('#batchLectureRoom').val('').trigger('chosen:updated');
    }, 0);

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newBatchInputs');
    inputs.forEach(function (input) {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //dynamic select content handling
    courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(batchCourse,' ',courses,'name');
    days = ajaxGetRequest("/Day/findall")
    fillSelectOptions(batchClassDay,' ',days,'name');
    lectureRooms = ajaxGetRequest("/LectureRoom/findall");
    fillSelectOptionsWithTwo(batchLectureRoom,' ',lectureRooms,'name','floor')

    //reset payment plan and its table
    batchPaymentPlan.innerHTML = '';
    paymentPlanRegistrationFee.innerText = '';
    paymentPlanCourseFee.innerText = '';
    paymentPlanTotalFee.innerText = '';
    paymentPlanInstallments.innerText = '';

    //hide timetable table
    tblTimetable.classList.add('d-none');

    //reset checkbox
    checkBoxValidator(this, leftWeekday, rightWeekday, 'newBatch', 'isWeekday', false, true)

    //initialize the 3rd party libraries (chosen)
    $('#batchCourse').chosen({width:'100%'});
    $('#batchClassDay').chosen({width:'100%'});
    $('#batchLectureRoom').chosen({width:'100%'});
    $('#batchPaymentPlan').chosen({width:'80%'});

    $('#batchCommenceDate').daterangepicker({
        "minDate": new Date(),
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": false,
        "drops": "down",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });
    $('#batchCommenceDate').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        inputTextValidator(this,'^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$','newBatch','commenceDate');
        calculateLastRegDate();
        calculateEndDate();
    });



}

//creating a function for checkbox validate and binding values to the object
//This function have seven arguments
// 1) elementID -> use 'this' or the html id of the checkbox
// 2) leftDivID -> left DIV html id
// 3) rightDivID -> right DIV html id
// 4) object -> The object that data should bind
// 5) property -> object property
// 6) trueValue-> value to bind if checkbox is checked
// 7) falseValue-> value to bind if checkbox is not checked
//This function is called using onclick event handler
const checkBoxValidator = (elementID,leftDivID,rightDivID,object,property,trueValue,falseValue) => {
    //checking if the checkbox is checked or not
    if (elementID.checked) {
        rightDivID.classList.add('bg-success', 'text-white');
        leftDivID.classList.remove('bg-success', 'text-white');
        window[object][property]=trueValue;
    } else {
        window[object][property]=falseValue;
        rightDivID.classList.remove('bg-success', 'text-white');
        leftDivID.classList.add('bg-success', 'text-white');

    }
}

const calculateLastRegDate =()=>{
    let startDateString=batchCommenceDate.value;
    console.log(startDateString);

    let startDate = new Date(startDateString);
    console.log(startDate);

    startDate.setDate(startDate.getDate() + 14);

    console.log(startDate.toISOString().split('T')[0])
   // batchLastRedDate.value = startDate.toISOString().split('T')[0];
    $('#batchLastRedDate').daterangepicker({
        "minDate": startDate.toISOString().split('T')[0],
        "singleDatePicker": true,
        "autoApply": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "drops": "up",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });


}

const calculateEndDate = ()=>{
    let startDateString= batchCommenceDate.value;
    console.log(startDateString);

    let startDate = new Date(startDateString);
    console.log(startDate);

    let durationInMonths = newBatch.courseID.duration;

    startDate.setMonth(startDate.getMonth() + durationInMonths);

    // console.log(startDate.toISOString().split('T')[0]);

    $('#batchEndDate').daterangepicker({
        "minDate": startDate.toISOString().split('T')[0],
        "singleDatePicker": true,
        "autoApply": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "drops": "up",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });
}

const fillPaymentPlan=()=>{
    //clear the commence date / end date and last reg date as well when a course is changed
    let dateInputs = [batchCommenceDate,batchEndDate,batchLastRedDate];
    dateInputs.forEach((input)=>{
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
        input.value ='';
    })

    let currentCourseId = newBatch.courseID.id;
    console.log(currentCourseId);
    let paymentPlans = ajaxGetRequest("/PaymentPlan/getActivePlans/"+currentCourseId);
    fillSelectOptions(batchPaymentPlan,' ',paymentPlans,'name');
    $('#batchPaymentPlan').val('').trigger('chosen:updated');

}

const showPaymentPlan=()=>{
    paymentPlanRegistrationFee.innerText = "Rs. "+(newBatch.paymentPlanID.registrationFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    paymentPlanCourseFee.innerText = "Rs. "+(newBatch.paymentPlanID.courseFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    paymentPlanTotalFee.innerText = "Rs. "+(newBatch.paymentPlanID.totalFee).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    paymentPlanInstallments.innerText = newBatch.paymentPlanID.numberOfInstallments;

}

const saveTimetable = () => {
    tblTimetable.classList.remove('d-none');
    let timeTableBody = tblTimetable.querySelector('tbody'); // Select the tbody element
    timeTableBody.innerHTML = '';
    console.log(newTimetable);
}

//creating a function to submit the batch form when ever needed
const newBatchSubmit = ()=>{
    console.log(newBatch);
    //calling the checkBatchFormErrors function and catching the return value to errors variable
    let errors = checkBatchFormErrors(newBatch);
    //check the errors variable is null
    //if it's null that means all the required inputs are filled
    if(errors===''){
        //get a user confirmation using external customConfirm js
        showCustomConfirm("You are about to add a New Batch<br>Are You Sure?", function (result) {
            if(result){
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                let serviceResponse = ajaxHttpRequest("/Batch",'POST',newBatch);
                //check the serviceResponse value is "OK"
                if(serviceResponse==="OK"){
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Batch Successfully Added!", "success");
                    //close the offcanvas sheet
                    offCanvasBatchCloseButton.click();
                    //refresh the table
                    refreshBatchTable();
                    //refresh the form
                    resetBatchForm();
                }
                else{
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed!" + serviceResponse, "error");
                }
            }
            //will execute this block if the user confirmation is "no"
            //show user an alert
            else{
                showCustomModal("Operation Cancelled!", "info");
            }
        });
    }
    else{
        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');

    }
}

//creating a function to edit the batch form when ever needed
const batchEdit = ()=>{

    //display the update button once the edit button is clicked
    btnBatchSheetUpdate.style.display = 'block';

    //remove the attribute readonly to make inputs accept the user input values
    //give a border color to inputs indicate that the input's values are ready to be edited
    inputs = document.querySelectorAll('.batchSheetInputs');

    //remove the disabled attribute from the select
    //give a border color to indicate that select can be now edited

    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
        input.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    });

    batchSheetWeekday.disabled = false;

}

//creating a reusable function to check all the required inputs are filled by checking bound values
//need to pass the object as a parameter
//this function will return if there are any unfilled inputs
const checkBatchFormErrors = (batchObject)=>{
    let errors = '';

    if(batchObject.courseID==null){
        errors = errors +'Course is Required<br>';
    }
    if(batchObject.commenceDate==null){
        errors = errors +'Commence Date is Required<br>';
    }
    if(batchObject.endDate==null){
        errors = errors +'End Date is Required<br>';
    }
    if(batchObject.lastRegDate==null){
        errors = errors +'Last Registration Date is Required<br>';
    }
    if(batchObject.seatCount==null){
        errors = errors +'Seat Count is Required<br>';
    }
    if(batchObject.isWeekday==null){
        errors = errors +'Delivery Mode is Required<br>';
    }
    if(batchObject.description==null){
        errors = errors +'Description is Required<br>';
    }
    if(batchObject.paymentPlanID==null){
        errors = errors +'Payment Plan is Required<br>';
    }

    return errors;

}