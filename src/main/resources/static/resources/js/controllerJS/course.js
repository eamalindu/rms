window.addEventListener("load", () => {

    //reset the course form
    resetCourseForm();
    //refresh the course table
    refreshCourseTable();

});

const refreshCourseTable = ()=>{
    //getting current batches from the database using ajaxGetRequest function and assign the response to the variable batches
    courses = ajaxGetRequest("/Course/findall");
    //creating a display property list for the batches
    displayPropertyListForCourse = [
        {property: 'name',dataType: 'text'},
        {property: 'code',dataType: 'text'},
        {property: getDuration,dataType: 'function'},
        {property: 'minimumRequirement',dataType: 'text'},
        {property: 'lectureHours',dataType: 'text'},
        {property: getStatus,dataType: 'function'},
    ]

    fillDataIntoTable(tblCourse, courses, displayPropertyListForCourse, rowView, '');

    $('#tblBatch').DataTable();

}

const resetCourseForm = ()=>{
    course = {};
}