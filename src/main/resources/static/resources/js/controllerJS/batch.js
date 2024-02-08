window.addEventListener("load",()=>{

    //reset the batch form
    resetBatchForm();
    //refresh the batch table
    refreshBatchTable();

    //validation chosen select (for new batch)
    $("#batchCourse").chosen().change(function () {
        $("#batchCourse_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchStatus").chosen().change(function () {
        $("#batchStatus_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchClassDay").chosen().change(function () {
        $("#batchClassDay_chosen .chosen-single").addClass('select-validated');
    });

    $('#batchCommenceDate').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        inputTextValidator(this,'^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$','newBatch','commenceDate');
        calculateLastRegDate();
        calculateEndDate();
    });
});


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

const getCourseName = (ob)=>{
    return ob.courseID.name;
}

const getWeekDay = (ob)=>{
    if(ob.isWeekday){
        return "Weekday";
    }
    else{
        return "Weekend";
    }

}

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

const rowView = ()=>{

}

const resetBatchForm = ()=>{

    $("#batchCourse_chosen .chosen-single").removeClass('select-validated');
    $("#batchStatus_chosen .chosen-single").removeClass('select-validated');
    batchCourse.classList.remove('is-valid');
    batchStatus.classList.remove('is-valid');


    //reset batch object
    newBatch = {}

    frmNewBatch.reset();

    //set default option chosen
    setTimeout(function () {
        $('#batchCourse').val('').trigger('chosen:updated');
        $('#batchStatus').val('').trigger('chosen:updated');
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
    statuses = ajaxGetRequest("/BatchStatus/findall");
    fillSelectOptions(batchStatus,' ',statuses,'name');

    //reset checkbox
    checkBoxValidator(this, leftWeekday, rightWeekday, 'newBatch', 'isWeekday', false, true)

    //initialize the 3rd party libraries (chosen)
    $('#batchCourse').chosen({width:'100%'});
    $('#batchStatus').chosen({width:'100%'});
    $('#batchCommenceDate').daterangepicker({
        "minDate": new Date(),
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": false,
        "drops": "up",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });




}

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
    let startDateString=batchCommenceDate.value;
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

const calculateTotalFee = ()=>{
    batchTotalFee.value = parseInt(batchRegistrationFee.value) + parseInt(batchCourseFee.value);
    newBatch.totalFee = parseInt(batchRegistrationFee.value) + parseInt(batchCourseFee.value);
}

const newBatchSubmit = ()=>{
    console.log(newBatch);

    serviceResponse = ajaxHttpRequest("/Batch",'POST',newBatch);
    if(serviceResponse==="OK"){
        //this means data successfully passed to the backend
        //show an alert to user
        showCustomModal("Batch Successfully Added!", "success");
        offCanvasBatchCloseButton.click();
        refreshBatchTable();
        resetBatchForm();

    }
    else{

        //this means there was a problem with the query
        //shows an error alert to the user
        showCustomModal("Operation Failed!" + serviceResponse, "error");
    }
}