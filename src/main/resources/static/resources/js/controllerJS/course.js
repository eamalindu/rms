window.addEventListener("load", () => {

    //reset the course form
    resetCourseForm();
    //refresh the course table
    refreshCourseTable();
    //reset inner form for module
    resetModuleInnerForm();

    //validation chosen select (for new batch)
    $("#courseRequirement").chosen().change(function () {
        $("#courseRequirement_chosen .chosen-single").addClass('select-validated');
    });
    $("#courseExistModules").chosen().change(function () {
        $("#courseExistModules_chosen .chosen-single").addClass('select-validated');
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
    newCourse.lessonList = [];

    //hide timetable table
    tblModule.classList.add('d-none');

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

    resetModuleForm();
}

const rowView = ()=>{

    //hide the update btn
    btnCourseSheetUpdate.style.display = 'none';
    //show the deleted btn
    btnCourseSheetDelete.style.display = 'block';

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

const resetModuleForm = ()=>{
    //remove validation class from the chosen select element
    $("#courseExistModules_chosen .chosen-single").removeClass('select-validated');
    //remove boostrap validation classes from the select elements
    courseExistModules.classList.remove('is-valid');

    //reset the frmNewBatch form using reset function
    frmNewModule.reset();

    //set default option for chosen select elements
    setTimeout(function () {
        $('#courseExistModules').val('').trigger('chosen:updated');
    }, 0);

    const lessons = ajaxGetRequest("/Lesson/findall")
    fillSelectOptions(courseExistModules, ' ', lessons, 'name');

    $('#courseExistModules').chosen({width: '83%'});
}

const addToArray = ()=>{
    if(courseExistModules.value!=='') {
    currentLesson = JSON.parse(courseExistModules.value)
    let isDuplicate = false;

        // Iterate over each element in the array
        for (let i = 0; i < newCourse.lessonList.length; i++) {
            const existingLesson = newCourse.lessonList[i];
            // Compare each property
            if (existingLesson.id === currentLesson.id) {
                // If a match is found, set isDuplicate to true and break out of the loop
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            showCustomConfirm("You are about to add the Module<br/><span class='text-steam-green'>" + currentLesson.name + "</span><br>Are You Sure?", function (result) {
                if (result) {
                    newCourse.lessonList.push(currentLesson)
                    console.log(newCourse.lessonList)
                    resetModuleForm();
                } else {
                    showCustomModal("Operation Cancelled!", "info");
                }
            });
        } else {
            // Handle duplicate entry
            showCustomModal("Duplicate Found!<br><span class='text-steam-green'>" + currentLesson.name + " </span><br/>Module is Already Added", "error");
        }
    }
    else{
        showCustomModal("Module is required!","warning")
    }
}

const displayLessons = ()=>{
    resetModuleForm();
    tblModule.classList.remove('d-none');
    let moduleTableBody = tblModule.querySelector('tbody'); // Select the tbody element
    moduleTableBody.innerHTML = '';
    let displayPropertyListForModule =[
        {property: 'name', dataType: 'text'}
    ];
    fillDataIntoTableWithDelete(tblModule,newCourse.lessonList,displayPropertyListForModule,removeRecord)

}


const removeRecord = (ob)=>{
    let extIndex = newCourse.lessonList.map(item=>item.id).indexOf(ob.id);
    if(extIndex!=-1){
        newCourse.lessonList.splice(extIndex,1)
        displayLessons();
    }
}

const resetModuleInnerForm = ()=>{
    newLesson = {}
    checkBoxValidator(moduleExam, leftWeekday, rightWeekday, 'newLesson', 'examAvailable', true, false)
}

const newCourseSubmit = ()=>{
    let serverResponse =  ajaxHttpRequest("/Course","POST",newCourse);
    console.log(serverResponse)
}

const newModuleSubmit = ()=>{
    let serverResponse = ajaxHttpRequest("/Lesson","POST",newLesson);
}