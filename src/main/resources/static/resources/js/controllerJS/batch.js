window.addEventListener("load",()=>{
    //refresh the batch table
    refreshBatchTable();
    //reset the batch form
    resetBatchForm();

    //validation chosen select (for new batch)
    $("#batchCourse").chosen().change(function () {
        $("#batchCourse_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchStatus").chosen().change(function () {
        $("#batchStatus_chosen .chosen-single").addClass('select-validated');
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
        {property:'createdBy',dataType:'text'},
    ];

    fillDataIntoTable(tblBatch,batches,displayPropertyListForBatches,rowView,'offcanvasBatchSheet')
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

const rowView = ()=>{

}

const resetBatchForm = ()=>{

    //reset batch object
    newBatch = {}

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
        "autoApply": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
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

const newBatchSubmit = ()=>{
    console.log(newBatch);
}