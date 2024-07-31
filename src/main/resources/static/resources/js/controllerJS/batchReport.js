window.addEventListener('load',()=>{

    resetSearchBar();

    reportColumnFormatForBatch = [
        {name: 'Course', data: 'courseID.code'},
        {name: 'Batch', data: 'batchCode'},
        {name: 'Description', data: 'description'},
        {name: 'Batch Start Date', data: 'commenceDate'},
        {name: 'Last Reg Date', data: 'lastRegDate'},
        {name: 'Batch End Date', data: 'endDate'},
        {name: 'Is Weekday', data: 'isWeekday'},
        {name: 'Fee', data: 'paymentPlanID.totalFee'},
        {name: 'Schedule', data: 'batchHasDayList'},
        {name: 'Status', data: 'batchStatusID.name'},

    ];

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

    displayPropertyListForRegistration = [
        {property: 'registrationNumber', dataType: 'text'},
        {property: getStudentName, dataType: 'function'},
        {property: getCourseName, dataType: 'function'},
        {property: getContactNumber, dataType: 'function'},
        {property: getDate, dataType: 'function'},
        {property: 'addedBy', dataType: 'text'},
        {property: getRegStatus, dataType: 'function'}
    ];

    fillDataIntoTableWithOutAction(tblBatchReport,batchReport,displayPropertyListForBatchInformation);
    fillDataIntoTableWithOutAction(tblBatchWiseRegistrations,registrationsForBatch,displayPropertyListForRegistration);
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

const getStudentName = (ob) => {

    return ob.studentID.title + ' ' + ob.studentID.nameWithInitials + ' <br/><span class="badge w-50 rounded-0" style="background: darkgrey">' + ob.studentID.studentNumber + '</span>';
}

const getCourseName = (ob) => {

    return ob.courseID.name + ' (' + ob.courseID.code + ')<br/><small class="text-muted">' + ob.batchID.batchCode + '</small>';
}

const getContactNumber = (ob) => {

    return ob.studentID.mobileNumber;
}


const getDate = (ob) => {
    return ob.timestamp.replace("T"," ");
}

const getRegStatus = (ob) => {
    return ob.registrationStatusID.name;
}

const batchReportToXlsx = ()=>{
    showCustomConfirm('You are about to export <span class="text-steam-green">Batch Report</span> data to an Excel spreadsheet<br><br>Are You Sure?',function (result){
        if(result){
            exportToExcel(batchReport,'Batch Report '+batchReport[0].batchCode,reportColumnFormatForBatch);
            // exportTableToExcel('tblDailyIncome','test');
        }
    });
}