window.addEventListener("load",()=>{
    //refresh the batch table
    refreshBatchTable();
    //reset the batch form
    resetBatchForm();

    //validation chosen select (for new batch)
    $("#batchCourse").chosen().change(function () {
        $("#batchCourse_chosen .chosen-single").addClass('select-validated');
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

    //dynamic select content handling
    courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(batchCourse,' ',courses,'name');

    //initialize the 3rd party libraries (chosen)
    $('#batchCourse').chosen({width:'100%'});
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

    //reset batch object
    newBatch = {}

}