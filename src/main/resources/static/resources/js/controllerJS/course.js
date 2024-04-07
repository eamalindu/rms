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

    $('#tblCourse').DataTable();

}

const resetCourseForm = ()=>{

    $("#courseRequirement_chosen .chosen-single").removeClass('select-validated');
    courseRequirement.classList.remove('is-valid');

    //reset the image src and the border color
    imgProfile.src = '';
    imgProfile.classList.remove('bg-success');

    newCourse = {};

    frmNewCourse.reset();

    //set default option chosen
    setTimeout(function () {
        $('#courseRequirement').val('').trigger('chosen:updated');
    }, 0);

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newCourseInputs');
    inputs.forEach(function (input) {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //initialize the 3rd party libraries (chosen)
    $('#courseRequirement').chosen({width: '100%'});
}

const rowView = ()=>{

    //hide the update btn
    btnCourseSheetUpdate.style.display = 'none';
    //show the deleted btn
    btnBatchSheetDelete.style.display = 'block';

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
    inputTextValidator(courseCode,'^[A-Z][a-z][A-Z]{1,}$','newCourse','code')
}