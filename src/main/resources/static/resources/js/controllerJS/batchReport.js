window.addEventListener('load',()=>{

    resetSearchBar();

    //validation chosen select (for new quick payment)
    $("#SearchCourse").chosen().change(function () {
        $("#SearchCourse_chosen .chosen-single").addClass('bg-light');
    });
    $("#SearchBatch").chosen().change(function () {
        $("#SearchBatch_chosen .chosen-single").addClass('bg-light');
    });
});

const resetSearchBar = ()=>{
    const courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(SearchCourse,' ',courses,'name');

    $('#SearchCourse').chosen({width: '225px'});
    $('#SearchBatch').chosen({width: '225px'});
}

const getBatches = ()=>{
    selectedCourse  = JSON.parse(SearchCourse.value);
    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/"+selectedCourse.id);
    fillSelectOptions(SearchBatch,' ',batches,'batchCode');
    SearchBatch.setAttribute('data-placeholder', 'Please Select a Batch');
    $('#SearchBatch').val('').trigger('chosen:updated');
}

const getBatchReport = ()=>{
    selectedBatch  = JSON.parse(SearchBatch.value);
   batchReport = ajaxGetRequest("/Batch/getBatchInfo/"+selectedBatch.batchCode);
   registrationsForBatch = ajaxGetRequest("/Registration/getRegistrations/"+selectedBatch.id);

   //fill table for batch information
    displayPropertyListForBatchInformation = [
        {property:getCourseCode,dataType:'function'},
        {property:'batchCode',dataType:'text'},
        {property:'description',dataType:'text'},
        {property:'commenceDate',dataType:'text'},
        {property:'lastRegDate',dataType:'text'},
        {property:'endDate',dataType:'text'},
        {property:getWeekDay,dataType:'function'},
        {property:getFee,dataType:'function'},
        {property:getSchedule,dataType:'function'},
        {property:getStatus,dataType:'function'},
    ];
    fillDataIntoTableWithOutAction(tblBatchReport,batchReport,displayPropertyListForBatchInformation);
}

const getCourseCode=(ob)=>{
    return ob.courseID.code;
}

const getWeekDay=(ob)=>{
    if(ob.isWeekday){
        return 'Weekday';
    }else{
        return 'Weekend';
    }
}
const getFee=(ob)=>{
    return "Rs. "+ob.paymentPlanID.totalFee.toLocaleString('en-US',{minimumFractionDigits:2});
}
const getSchedule=(ob)=>{
    schduleString = '';
    ob.batchHasDayList.forEach((schedule)=>{
        schduleString += schedule.dayID.name + " [" + schedule.startTime.slice(0, -3) + " - " + schedule.endTime.slice(0, -3) + "]<br>";
    });
    return schduleString;
}
const getStatus=(ob)=>{
    return ob.batchStatusID.name;
}