window.addEventListener('load',()=>{
    resetSearchBar();

    //validation chosen select (for new User)
    $("#markSearchBatch").chosen().change(function () {
        $("#markSearchBatch_chosen .chosen-single").addClass('bg-light');
    });
    $("#markSearchRegistration").chosen().change(function () {
        $("#markSearchRegistration_chosen .chosen-single").addClass('bg-light');
    });
    reportColumnFormat = [
        {name: 'Registration Number', data: 'registrationID.registrationNumber'},
        {name: 'Student', data: 'registrationID.studentID.nameWithInitials'},
        {name: 'Course', data: 'batchID.courseID.name'},
        {name: 'Batch', data: 'batchID.batchCode'},
        {name: 'Lesson', data: 'lessonID.name'},
        {name: 'Lesson Code', data: 'lessonID.code'},
        {name: 'Marks', data: 'marks'},
        {name: 'Verified?', data: 'isVerified'},
        {name: 'Added By', data: 'addedBy'},
        {name: 'Date and Time', data: 'timeStamp'},
    ];
})

const resetSearchBar = () => {
    const batches = ajaxGetRequest("/Batch/findall");
    fillSelectOptions(markSearchBatch,' ',batches,'batchCode');
    $('#markSearchBatch').chosen({width:'40%'})
    $('#markSearchRegistration').chosen({width:'40%'})

}

const getRegistrations = ()=>{
    const selectedBatch = JSON.parse(markSearchBatch.value);
    const registrations = ajaxGetRequest('/Registration/getRegistrations/'+selectedBatch.id);
    fillSelectOptions(markSearchRegistration,' ',registrations,'registrationNumber');
    markSearchRegistration.setAttribute('data-placeholder','Select a Registration');
    $('#markSearchRegistration').trigger('chosen:updated');
}

const getMarkReport = () => {
    let batchSelected = false;
    let registrationSelected = false;

    if(markSearchBatch.value !== ''){
        batchSelected = true;
    }
    if(markSearchRegistration.value !== ''){
        registrationSelected = true;
    }

    // Condition 1: Neither batch nor registration is selected
    if (!batchSelected && !registrationSelected) {
        showCustomModal('Please select a batch or a registration to generate the report','warning');
    }
    // Condition 2: Only batch is selected
    else if (batchSelected && !registrationSelected) {
        marks = ajaxGetRequest('/Mark/getByBatchID/'+JSON.parse(markSearchBatch.value).id);
    }
    // Condition 3: Only registration is selected
    else if (!batchSelected && registrationSelected) {
       //this cant happen because registration is dependent on batch
    }
    // Condition 4: Both batch and registration are selected
    else if (batchSelected && registrationSelected) {
       marks = ajaxGetRequest('/Mark/getByRegistrationID/'+JSON.parse(markSearchRegistration.value).id);
    }
    dataListForMarkReport = [
        {property: getRegistrationNumber, dataType: 'function'},
        {property: getStudent, dataType: 'function'},
        {property: getBatch, dataType: 'function'},
        {property: getLesson, dataType: 'function'},
        {property: 'marks', dataType: 'text'},
        {property: getStatus, dataType: 'function'},]

    fillDataIntoTableWithOutAction(tblMarkReport,marks,dataListForMarkReport);


}

const getRegistrationNumber =(ob)=>{
    return ob.registrationID.registrationNumber;
}
const getStudent =(ob)=>{
    return ob.registrationID.studentID.nameWithInitials;
}
const getBatch =(ob)=>{
    return ob.batchID.courseID.name + ' (' + ob.batchID.courseID.code + ')<br/><small class="text-muted">' + ob.batchID.batchCode + '</small>';
}
const getLesson =(ob)=>{
    return ob.lessonID.name;
}
const getStatus =(ob)=>{
    if(ob.isVerified) {
        return 'Verified';
    }
    else{
        return 'Not-Verified';
    }
}

const markReportToXlsx = ()=>{
    showCustomConfirm('You are about to export <span class="text-steam-green">Mark Report</span> data to an Excel spreadsheet<br><br>Are You Sure?',function (result){
        if(result){
            exportToExcel(marks,'Mark Report',reportColumnFormat);
            // exportTableToExcel('tblDailyIncome','test');
        }
    });
}