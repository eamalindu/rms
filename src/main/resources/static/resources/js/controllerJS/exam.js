window.addEventListener('load',()=>{
    resetMarkForm();
    refreshMarkTable();
})

const resetMarkForm = () => {

    newExamMark = {};

    const batches = ajaxGetRequest("/Batch/findall");
    fillSelectOptions(examMarksBatch,' ',batches,'batchCode');

    $('#examMarksBatch').chosen({width:'100%'});
    $('#examMarksRegistration').chosen({width:'100%'});
    $('#examLesson').chosen({width:'100%'});
}

const refreshMarkTable = () => {
    //getting current Marks from the database using ajaxGetRequest function and assign the response to the variable batches
    marks = ajaxGetRequest("/Mark/findall");
    //creating a display property list for the Mark
    displayPropertyListForMark = [
        {property: getRegistrationNumber, dataType: 'function'},
        {property: getStudent, dataType: 'function'},
        {property: getBatch, dataType: 'function'},
        {property: getLesson, dataType: 'function'},
        {property: 'mark', dataType: 'text'},
        {property: getStatus, dataType: 'function'},]
    //using external function fillDataIntoTable to fill the data to the table tblExamMarks according to the displayPropertyListForMark list
    fillDataIntoTable(tblExamMarks, marks, displayPropertyListForMark, rowView, 'offcanvasMarkSheet');

    //check the length of the marks array
    if (marks.length !== 0) {
        //initializing DataTable for the tblExamMarks table
        $('#tblExamMarks').DataTable();
    }

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
        return '<span class="badge rounded-0" style="background: #3FB618">Verified</span>';
    }
    else{
        return '<span class="badge rounded-0" style="background: #ea2f1e">Not-Verified</span>';
    }
}

const rowView = (ob)=>{

}

const getRegistrations = () => {
    const selectedBatch = JSON.parse(examMarksBatch.value);
    registrations = ajaxGetRequest("/Registration/getRegistrations/"+selectedBatch.id);
    fillSelectOptionsWithTwo(examMarksRegistration,' ',registrations,'registrationNumber','studentID.nameWithInitials');
    $('#examMarksRegistration').trigger('chosen:updated');

}

const getLessons = () => {
    const selectedBatch = JSON.parse(examMarksBatch.value);
    let lessonList = selectedBatch.courseID.lessonList;
    lessonList.sort((a,b)=>a.id - b.id);
   fillSelectOptionsWithTwo(examLesson,' ',lessonList,'code','name');
    $('#examLesson').trigger('chosen:updated');
}