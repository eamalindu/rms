window.addEventListener("load",()=>{
    //refresh the batch table
    refreshBatchTable();
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