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

    //get all the inputs with the class name batchSheetInputs and save it as an array
    inputs = document.querySelectorAll('.courseSheetInputs');
    //using forEach Function to remove inline styles,boostrap validation classes and set the disabled property to true
    inputs.forEach(function (input) {
        //add the attribute disabled to make inputs block the user input values
        //remove the edited border colors from the inputs
        input.setAttribute('disabled', 'true');
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //setting the data that can be directly accessible from the current object to the relevant input element
    batchSheetCode.innerText = ob.batchCode;
    batchSheetCreated.value = ob.createdBy;
    batchSheetCommenceDate.value = ob.commenceDate;
    batchSheetEndDate.value = ob.endDate;
    batchSheetSeatCount.value = ob.seatCount;
    batchSheetLastDate.value = ob.lastRegDate;
    batchSheetDescription.value = ob.description;

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

    inputs = document.querySelectorAll('.newModuleInputs');
    inputs.forEach(function (input) {
        //remove the inline css from inputs
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    newLesson = {}
    frmAddNewModule.reset();
    checkBoxValidator(moduleExam, leftWeekday, rightWeekday, 'newLesson', 'examAvailable', true, false)

}

const newCourseSubmit = ()=>{
    //calling the checkCourseFormErrors function and catching the return value to errors variable
    let errors = checkCourseFormErrors(newCourse);
    //check the errors variable is null
    //if it's null that means all the required inputs are filled
    if(errors===''){
        //get a user confirmation using external customConfirm js
        showCustomConfirm("You are about to add a New Batch<br>Are You Sure?", function (result) {
            if (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                let serverResponse = ajaxHttpRequest("/Course", "POST", newCourse);
                //check the serviceResponse value is "OK"
                if (serviceResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Course Successfully Added!", "success");
                    //close the offcanvas sheet
                    offCanvasCourseCloseButton.click();
                    //refresh the table
                    refreshCourseTable();
                    //refresh the form
                    resetCourseForm();
                }
                else{
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed!" + serviceResponse, "error");
                }
            }
            //will execute this block if the user confirmation is "no"
            //show user an alert
            else {
                showCustomModal("Operation Cancelled!", "info");
            }
        });
    }
    else{
        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');
    }



}

const newModuleSubmit = ()=>{
    let errors = checkInnerFormModule();
    if(errors==='') {

        showCustomConfirm("You are about to add a New Module<br>Are You Sure?", function (result) {
            if (result) {
                let serverResponse = ajaxHttpRequest("/Lesson", "POST", newLesson);
                if (serverResponse === "OK") {
                    //get the saved full lesson from the database
                    const savedLesson = ajaxGetRequest("Lesson/getLessonByCode/" + newLesson.code);
                    newCourse.lessonList.push(savedLesson);
                    resetModuleInnerForm();
                    showCustomModal("Lesson Successfully Added!", "success")
                    //close the modal
                    modalModuleCloseButton.click();
                } else {
                    showCustomModal("Operation Failed!" + serverResponse, "error");

                }
            } else {
                showCustomModal("Operation Cancelled!", "info");
            }
        });

    }
    else{
        showCustomModal(errors, 'warning');
    }
}

const checkInnerFormModule = ()=>{
    let errors = '';

    if(newLesson.code==null){
        errors = errors + 'Code is Required<br>';
    }
    if(newLesson.name==null){
        errors = errors + 'Name is Required<br>';
    }

    return errors;
}

const checkCourseFormErrors =(courseObject)=>{
    let errors = '';

    if(courseObject.name==null){
        errors = errors + 'Name is Required<br>';
    }
    if(courseObject.code==null){
        errors = errors + 'Code is Required<br>';
    }
    if(courseObject.duration==null){
        errors = errors + 'Duration is Required<br>';
    }
    if(courseObject.minimumRequirement==null){
        errors = errors + 'Minimum Requirement is Required<br>';
    }
    if(courseObject.lectureHours==null){
        errors = errors + 'Lecture Hours is Required<br>';
    }
    if(courseObject.lessonList.length===0){
        errors = errors + 'Course Modules Are Required<br>';
    }

    return errors;
}