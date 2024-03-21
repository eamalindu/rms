window.addEventListener("load", () => {

    //reset the course form
    resetCourseForm();
    //refresh the course table
    refreshCourseTable();

    //validation chosen select (for new batch)
    $("#courseRequirement").chosen().change(function () {
        $("#courseRequirement_chosen .chosen-single").addClass('select-validated');
    });

});

const refreshCourseTable = ()=>{
    //getting current Course from the database using ajaxGetRequest function and assign the response to the variable batches
    courses = ajaxGetRequest("/Course/findall");
    //creating a display property list for the Course
    displayPropertyListForCourse = [
        {property: 'name',dataType: 'text'},
        {property: 'code',dataType: 'text'},
        {property: getDuration,dataType: 'function'},
        {property: 'minimumRequirement',dataType: 'text'},
        {property: 'lectureHours',dataType: 'text'},
        {property: getStatus,dataType: 'function'},
    ]

    fillDataIntoTable(tblCourse, courses, displayPropertyListForCourse, rowView, 'offcanvasCourseSheet');

    $('#tblBatch').DataTable();

}

const resetCourseForm = ()=>{
    newCourse = {};
    courseRequirement
    //initialize the 3rd party libraries (chosen)
    $('#courseRequirement').chosen({width: '100%'});
}

const rowView = ()=>{

}
const getDuration=(ob)=>{
    return ob.duration +" Months";
}

const getStatus=(ob)=>{
    if(ob.status){
        return '<span class="badge rounded-0" style="background: #3FB618">Active</span>';
    }
    else{
        return '<span class="badge rounded-0" style="background: #FF0039">Inactive</span>';
    }
}

const generateCourseCode = ()=>{
    const courseNameParts = courseName.value.split(" ");
    let code = '';
    courseNameParts.forEach((word)=>{
        code += word[0];
    })
    courseCode.value = code;
    inputTextValidator(courseCode,'^[A-Z][a-z][A-Z]$','newCourse','code')
}