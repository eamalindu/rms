window.addEventListener('load',()=>{
    resetMarkForm();
    refreshMarkTable();
})

const resetMarkForm = () => {

}

const refreshMarkTable = () => {
    //getting current Marks from the database using ajaxGetRequest function and assign the response to the variable batches
    marks = ajaxGetRequest("/Mark/findall");
    //creating a display property list for the Mark
    displayPropertyListForMark = [{property: 'name', dataType: 'text'},
        {property: 'code', dataType: 'text'},
        {property: getDuration, dataType: 'function'},
        {property: 'minimumRequirement', dataType: 'text'},
        {property: 'lectureHours', dataType: 'text'},
        {property: getStatus, dataType: 'function'},]
    //using external function fillDataIntoTable to fill the data to the table tblExamMarks according to the displayPropertyListForMark list
    fillDataIntoTable(tblExamMarks, marks, displayPropertyListForMark, rowView, 'offcanvasMarkSheet');

    //check the length of the marks array
    if (marks.length !== 0) {
        //initializing DataTable for the tblExamMarks table
        $('#tblExamMarks').DataTable();
    }

}