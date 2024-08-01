window.addEventListener("load", () => {

    //reset the batch form
    resetBatchForm();
    //refresh the batch table
    refreshBatchTable();
    //reset paymentPlan form
    resetPaymentPlanForm();

    //validation chosen select (for new batch)
    $("#batchCourse").chosen().change(function () {
        $("#batchCourse_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchClassDay").chosen().change(function () {
        $("#batchClassDay_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchPaymentPlan").chosen().change(function () {
        $("#batchPaymentPlan_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchLectureRoom").chosen().change(function () {
        $("#batchLectureRoom_chosen .chosen-single").addClass('select-validated');
    });
    $("#batchLecturer").chosen().change(function () {
        $("#batchLecturer_chosen .chosen-single").addClass('select-validated');
    });

    //bind data to the batch object, once the "apply" button on batchCommenceDate input is clicked
    $('#batchCommenceDate').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        //binding data to newBatch object
        inputTextValidator(this, '^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$', 'newBatch', 'commenceDate');
        //calling the calculateLastRegDate function to auto generated the last registration date according to the selected commence date
        calculateLastRegDate();
        //calling the calculateLastRegDate function to auto generated the batch end date according to the selected commence date
        calculateEndDate();
    });

    //toggle the visibility of the table when the h5 tag is clicked
    toggleRegistrationSheetTable(currentPaymentPlanHeadingText,tblCurrentPaymentPlan,currentPaymentPlanIcon);
    toggleRegistrationSheetTable(currentScheduleHeadingText,tblBatchSchedule,currentScheduleIcon);

});

//creating a function to refresh the batch table when ever needed
const refreshBatchTable = () => {

    //getting current batches from the database using ajaxGetRequest function and assign the response to the variable batches
    batches = ajaxGetRequest("/Batch/findall");
    //creating a display property list for the batches
    displayPropertyListForBatches = [{property: getCourseName, dataType: 'function'}, {
        property: 'batchCode', dataType: 'text'
    }, {property: 'commenceDate', dataType: 'text'}, {property: 'endDate', dataType: 'text'}, {
        property: getWeekDay, dataType: 'function'
    }, {property: 'seatCount', dataType: 'text'}, {property: 'description', dataType: 'text'}, {
        property: getStatus, dataType: 'function'
    },];

    //using external function fillDataIntoTable to fill the data to the table tblBatch according to the displayPropertyListForBatches list
    fillDataIntoTable(tblBatch, batches, displayPropertyListForBatches, rowView, 'offcanvasBatchSheet');

    //initializing DataTable for the tblBatch table

    if(batches.length!==0){
    $('#tblBatch').DataTable();
    }
}

//since we cant access the Course Name from the batches directly. creating a function to return the Course Name from the batches object
const getCourseName = (ob) => {
    return ob.courseID.name;
}

//since the isWeekday data type is in boolean we cant show true or false in the table
//creating a function to return Weekday and Not Weekday based on their value
const getWeekDay = (ob) => {
    if (ob.isWeekday) {
        return "Weekday";
    } else {
        return "Weekend";
    }

}

//since we cant access the Course Status from the batches directly. creating a function to return the Course Status from the batches object
const getStatus = (ob) => {
    //if the batch status is equal to scheduled function will return a span element with inline css to match their status
    if (ob.batchStatusID.name === "Scheduled") {
        return '<span class="badge rounded-0" style="background: #3FB618">Scheduled</span>';
    } else if (ob.batchStatusID.name === "Started") {
        return '<span class="badge rounded-0" style="background: #ea8a1e">Started</span>';
    } else if (ob.batchStatusID.name === "Canceled") {
        return '<span class="badge rounded-0" style="background: #ea2f1e">Canceled</span>';
    }
    else if (ob.batchStatusID.name ==='Deleted'){
        return '<span class="badge rounded-0" style="background: #000">Deleted</span>';
    }
    else {
        return '<span class="badge rounded-0" style="background: #1eadea">Completed</span>';
    }

}

//created a function to show to details in an offcanvas
const rowView = (ob, index) => {

    //click the info tab button so that it will show first always
    document.getElementById('pills-home-tab').click();
    //hide the update btn
    btnBatchSheetUpdate.style.display = 'none';
    //show the deleted btn
    btnBatchSheetDelete.style.display = 'block';

    //get all the inputs with the class name batchSheetInputs and save it as an array
    inputs = document.querySelectorAll('.batchSheetInputs');
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

    //disable radio button
    batchSheetWeekday.disabled = true;

    //setting the data that can be directly accessible from the current object to the relevant input element
    batchSheetCode.innerText = ob.batchCode;
    batchSheetCreated.value = ob.createdBy;
    batchSheetCommenceDate.value = ob.commenceDate;
    batchSheetEndDate.value = ob.endDate;
    batchSheetSeatCount.value = ob.seatCount;
    batchSheetLastDate.value = ob.lastRegDate;
    batchSheetDescription.value = ob.description;


    //using an if conditional statement to set the text color of the batchSheetCode element
    //if the batch status is equal to scheduled set the text color of the batchSheetCode to text-success and remove unwanted classes
    if (ob.batchStatusID.name === 'Scheduled') {
        batchSheetCode.classList.add('text-success');

        batchSheetCode.classList.remove('text-warning');
        batchSheetCode.classList.remove('text-steam-green');
        batchSheetCode.classList.remove('text-danger');
    } else if (ob.batchStatusID.name === 'Started') {
        batchSheetCode.classList.add('text-warning');

        batchSheetCode.classList.remove('text-success');
        batchSheetCode.classList.remove('text-steam-green');
        batchSheetCode.classList.remove('text-danger');
    } else if (ob.batchStatusID.name === 'Completed') {
        batchSheetCode.classList.add('text-steam-green');

        batchSheetCode.classList.remove('text-success');
        batchSheetCode.classList.remove('text-warning');
        batchSheetCode.classList.remove('text-danger');
    }
    else if(ob.batchStatusID.name ==='Deleted'){
        btnBatchSheetDelete.style.display = 'none';
        batchSheetCode.classList.remove('text-success');
        batchSheetCode.classList.remove('text-warning');
        batchSheetCode.classList.remove('text-danger');
        batchSheetCode.classList.remove('text-steam-green');
    }
    else {
        batchSheetCode.classList.add('text-danger');

        batchSheetCode.classList.remove('text-success');
        batchSheetCode.classList.remove('text-warning');
        batchSheetCode.classList.remove('text-steam-green');
    }

    //using an if conditional statement to set the value and background color of the radio batchSheetWeekday
    //if the batch is weekday add the relevant classes and remove unwanted classes and set the value of the batchSheetWeekday to true
    if (ob.isWeekday) {
        batchSheetWeekday.checked = false;
        rightWeekdaySheet.classList.remove('bg-success', 'text-white');
        leftWeekdaySheet.classList.add('bg-success', 'text-white');
    } else {
        batchSheetWeekday.checked = true;
        rightWeekdaySheet.classList.add('bg-success', 'text-white');
        leftWeekdaySheet.classList.remove('bg-success', 'text-white');


    }

    //using external function ajaxGetRequest to get the active payment plans for the selected course by providing courseID.id and save it in paymentPlans
    paymentPlans = ajaxGetRequest("/PaymentPlan/getActivePlans/" + ob.courseID.id);
    //using external function ajaxGetRequest to get all the batchStatus from the database and save it in batchStatus variable
    batchStatus = ajaxGetRequest("/BatchStatus/findall");

    //using the external function fillSelectOptions to fill the data from the database to the select element (dynamic select)
    //this function is a variation of the fillSelectOption because it accepts a fifth parameter to display the selected value in the provided property
    fillSelectOptions(batchSheetCourse, 'Please Select a Course', courses, 'name', ob.courseID.name)
    fillSelectOptions(batchSheetPaymentPlan, 'Please Select a Payment Plan', paymentPlans, 'name', ob.paymentPlanID.name)
    fillSelectOptions(batchSheetStatus, 'Please Select a Status', batchStatus, 'name', ob.batchStatusID.name)


    //setting the values of the payment plan to their relevant elements
    //using toLocaleString Function to format the current value into a currency type
    //example 5000 -> 5,000.00
    //concatenate the formated value with "Rs. " string
    batchSheetPaymentPlanRegistrationFee.innerText = "Rs. " + ob.paymentPlanID.registrationFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    batchSheetPaymentPlanCourseFee.innerText = "Rs. " + ob.paymentPlanID.courseFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    batchSheetPaymentPlanTotalFee.innerText = "Rs. " + ob.paymentPlanID.totalFee.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    //setting value for batchSheetPaymentPlanInstallments
    batchSheetPaymentPlanInstallments.innerText = ob.paymentPlanID.numberOfInstallments;

    const displayPropertyListForClassSchedule = [
        {property: getScheduleDay, dataType: 'function'},
        {property: getScheduleStartTime, dataType: 'function'},
        {property: getScheduleEndTime, dataType: 'function'},
        {property: getClassRoom, dataType: 'function'},
    ];
    //setting class schedule
    fillDataIntoTableWithOutAction(tblBatchSchedule,ob.batchHasDayList,displayPropertyListForClassSchedule)

    //initialize 3rd party daterangepicker library
    //Set the minDate for the batchSheetCommenceDate as the current object's commenceDate value
    $('#batchSheetCommenceDate').daterangepicker({
        "minDate": ob.commenceDate,
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": false,
        "drops": "down",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });

    //Set the minDate for the batchSheetEndDate as the current object's endDate value
    $('#batchSheetEndDate').daterangepicker({
        "minDate": ob.endDate,
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": false,
        "drops": "down",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });

    //Set the minDate for the batchSheetLastDate as the current object's lastRegDate value
    $('#batchSheetLastDate').daterangepicker({
        "minDate": ob.lastRegDate,
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": false,
        "drops": "down",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });

    //bind data to the editedBatch object, once the "apply" button on batchSheetCommenceDate input is clicked
    $('#batchSheetCommenceDate').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        inputTextValidator(this, '^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$', 'editedBatch', 'commenceDate');
    });
    //bind data to the editedBatch object, once the "apply" button on batchSheetEndDate input is clicked
    $('#batchSheetEndDate').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        inputTextValidator(this, '^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$', 'editedBatch', 'endDate');
    });
    //bind data to the editedBatch object, once the "apply" button on batchSheetLastDate input is clicked
    $('#batchSheetLastDate').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        inputTextValidator(this, '^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$', 'editedBatch', 'lastRegDate');
    });


    //save the current object as oldBatch and editedBatch for comparing purposes
    //using deep copies of the current object for independent modification
    oldBatch = JSON.parse(JSON.stringify(ob));
    editedBatch = JSON.parse(JSON.stringify(ob));

    //using external function to get the registrations done to the current batch from the database and save it to registrationsFromBatch variable;
    const registrationsFromBatch = ajaxGetRequest("/Registration/getRegistrations/"+ob.id);
    //using the array length to set the total registrations done for the current batch
    registrationCount.innerText = registrationsFromBatch.length;

    //creating a display property list for the batch registrations
    const displayPropertyListForRegistrationsFromBatch = [
        {property: 'registrationNumber', dataType: 'text'},
        {property: getStudentName, dataType: 'function'},
        {property: getStudentContact, dataType: 'function'},
        {property: getStudentStatus, dataType: 'function'},
    ]
    //using external function fillDataIntoTableWithOutAction to fill the data to the table tblRegistrations according to the displayPropertyListForRegistrationsFromBatch without buttons
    fillDataIntoTableWithOutAction(tblRegistrations,registrationsFromBatch,displayPropertyListForRegistrationsFromBatch)

}

//since the student name is a composite data (title+nameWithInitials)
//creating a function to return student name by combining title with nameWithInitials
const getStudentName=(ob)=>{
    return ob.studentID.title+" "+ob.studentID.nameWithInitials;
}

//since the mobile number cannot be access directly
//creating a function to return student mobile number
const getStudentContact=(ob)=>{
    return ob.studentID.mobileNumber;
}

//since the registrationStatusID cannot be access directly
//creating a function to return student registrationStatus
const getStudentStatus=(ob)=>{
    //if the registration status is equal to Active function will return a span element with inline css to match their status
    if (ob.registrationStatusID.name === "Active") {
        return '<span class="badge rounded-0" style="background: #3FB618">Active</span>';
    } else if (ob.registrationStatusID.name === "Suspended") {
        return '<span class="badge rounded-0" style="background: #ea8a1e">Suspended</span>';
    } else if (ob.registrationStatusID.name === "Cancelled") {
        return '<span class="badge rounded-0" style="background: #ea2f1e">Cancelled</span>';
    }
    else if (ob.registrationStatusID.name === "Pending"){
        return '<span class="badge rounded-0" style="background: #616161">Pending</span>';
    }
    else if (ob.registrationStatusID.name === "In Review"){
        return '<span class="badge rounded-0" style="background: #d8b73a">In Review</span>';
    }
    else{
        return '<span class="badge rounded-0" style="background: #000">Deleted</span>';
    }
}

const getScheduleDay = (ob)=>{

    return ob.dayID.name;
}

const getScheduleStartTime = (ob)=>{
    return ob.startTime.slice(0,-3);
}

const getScheduleEndTime = (ob)=>{
    return ob.endTime.slice(0,-3);
}

const getClassRoom = (ob)=>{
    return ob.lectureRoomID.name+", "+ob.lectureRoomID.floor;
}

//creating a function to reset the Batch form when ever needed
const resetBatchForm = () => {

    //remove validation class from the chosen select element
    $("#batchCourse_chosen .chosen-single").removeClass('select-validated');
    $("#batchPaymentPlan_chosen .chosen-single").removeClass('select-validated');
    $("#batchCourse_chosen .chosen-single").removeClass('select-invalidated');
    $("#batchPaymentPlan_chosen .chosen-single").removeClass('select-invalidated');

    //remove boostrap validation classes from the select elements
    batchCourse.classList.remove('is-valid');
    batchClassDay.classList.remove('is-valid');
    batchPaymentPlan.classList.remove('is-valid');
    batchLectureRoom.classList.remove('is-valid');
    batchCourse.classList.remove('is-invalid');
    batchClassDay.classList.remove('is-invalid');
    batchPaymentPlan.classList.remove('is-invalid');
    batchLectureRoom.classList.remove('is-invalid');

    //reset batch object
    newBatch = {}

    //reset batchHasDays array
    newBatch.batchHasDayList = [];

    //reset the frmNewBatch form using reset function
    frmNewBatch.reset();

    //set default option for chosen select elements
    setTimeout(function () {
        $('#batchCourse').val('').trigger('chosen:updated');
        $('#batchClassDay').val('').trigger('chosen:updated');
        $('#batchPaymentPlan').val('').trigger('chosen:updated');
        $('#batchLectureRoom').val('').trigger('chosen:updated');
    }, 0);

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newBatchInputs');
    inputs.forEach(function (input) {
        //remove the inline css from inputs
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //using external function ajaxGetRequest to get all the course data from the database and save it in the variable courses
    courses = ajaxGetRequest("/Course/findall");
    //using external function fillSelectOptions fill course name as the options for the batchCourse select element
    fillSelectOptions(batchCourse, ' ', courses, 'name');


    //reset payment plan and its table
    batchPaymentPlan.innerHTML = '';
    paymentPlanRegistrationFee.innerText = '';
    paymentPlanCourseFee.innerText = '';
    paymentPlanTotalFee.innerText = '';
    paymentPlanInstallments.innerText = '';

    //hide timetable table
    tblTimetable.classList.add('d-none');

    //reset checkbox batchWeekday
    checkBoxValidator(batchWeekday, leftWeekday, rightWeekday, 'newBatch', 'isWeekday', false, true)

    //set placeholder for chosen select batchPaymentPlan
    batchPaymentPlan.setAttribute('data-placeholder','Please Select a Course First');

    //initialize the 3rd party libraries (chosen)
    $('#batchCourse').chosen({width: '100%'});
    $('#batchPaymentPlan').chosen({width: '80%'});

    //initialize 3rd party daterangepicker library
    //Set the minDate for current day
    $('#batchCommenceDate').daterangepicker({
        "minDate": new Date(),
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": false,
        "drops": "down",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });

    //bind data to the batch object, once the "apply" button on batchCommenceDate input is clicked
    $('#batchCommenceDate').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        //binding data to newBatch object
        inputTextValidator(this, '^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$', 'newBatch', 'commenceDate');
        //calling the calculateLastRegDate function to auto generated the last registration date according to the selected commence date
        calculateLastRegDate();
        //calling the calculateLastRegDate function to auto generated the batch end date according to the selected commence date
        calculateEndDate();
    });

    //calling the resetTimeTableForm function to reset the inner form
    resetTimeTableForm();
}

//creating a function to reset the Time Table (inner form) form when ever needed
const resetTimeTableForm = ()=>{

    //remove validation class from the chosen select element
    $("#batchClassDay_chosen .chosen-single").removeClass('select-validated');
    $("#batchLectureRoom_chosen .chosen-single").removeClass('select-validated');
    $("#batchLecturer_chosen .chosen-single").removeClass('select-validated');
    $("#batchClassDay_chosen .chosen-single").removeClass('select-invalidated');
    $("#batchLectureRoom_chosen .chosen-single").removeClass('select-invalidated');
    $("#batchLecturer_chosen .chosen-single").removeClass('select-invalidated');
    //remove boostrap validation classes from the select elements
    batchClassDay.classList.remove('is-valid');
    batchLectureRoom.classList.remove('is-valid');
    batchLecturer.classList.remove('is-valid');
    batchClassDay.classList.remove('is-invalid');
    batchLectureRoom.classList.remove('is-invalid');
    batchLecturer.classList.remove('is-invalid');

    //reset batchHasDay object
    batchHasDay = {};

    //reset the frmNewBatch form using reset function
    frmNewTimeTable.reset();

    //set default option for chosen select elements
    setTimeout(function () {
        $('#batchClassDay').val('').trigger('chosen:updated');
        $('#batchLectureRoom').val('').trigger('chosen:updated');
        $('#batchLecturer').val('').trigger('chosen:updated');
    }, 0);

    //remove the inline css from inputs
    batchStartTime.style = '';
    //remove bootstrap validation classes
    batchStartTime.classList.remove('is-valid');
    batchStartTime.classList.remove('is-invalid');

    //remove the inline css from inputs
    batchEndTime.style = '';
    //remove bootstrap validation classes
    batchEndTime.classList.remove('is-valid');
    batchEndTime.classList.remove('is-invalid');

    //using external function ajaxGetRequest to get all the days data from the database and save it in the variable days
    days = ajaxGetRequest("/Day/findall")
    //using external function fillSelectOptions fill course name as the options for the batchClassDay select element
    fillSelectOptions(batchClassDay, ' ', days, 'name');

    //using external function ajaxGetRequest to get all the lecture rooms data from the database and save it in the variable lectureRooms
    lectureRooms = ajaxGetRequest("/LectureRoom/findall");
    //using external function fillSelectOptions fill course name as the options for the batchLectureRoom select element
    fillSelectOptionsWithTwo(batchLectureRoom, ' ', lectureRooms, 'name', 'floor')

    //using external function ajaxGetRequest to get all the lecture rooms data from the database and save it in the variable lectureRooms
    lecturers = ajaxGetRequest("/Lecturer/getActiveLecturers");
    //using external function fillSelectOptions fill course name as the options for the batchLectureRoom select element
    fillSelectOptionsWithTwo(batchLecturer, ' ', lecturers, 'lecturerCode','name')

    //initialize the 3rd party libraries (chosen)
    $('#batchClassDay').chosen({width: '100%'});
    $('#batchLectureRoom').chosen({width: '100%'});
    $('#batchLecturer').chosen({width: '100%'});
}

//creating a function to auto generate the last registration date according to the selected commence date
const calculateLastRegDate = () => {

    //get the batchCommenceDate input value and save it to startDateString variable
    let startDateString = batchCommenceDate.value;
    console.log(startDateString);

    //parse the startDateString from string in to a Date type
    let startDate = new Date(startDateString);
    console.log(startDate);

    //set the startDate to 14 days after the batch commence date
    startDate.setDate(startDate.getDate() + 14);

    console.log(startDate.toISOString().split('T')[0])
    // batchLastRedDate.value = startDate.toISOString().split('T')[0];

    //initialize and set the minDate of the batchLastRedDate to startDate
    //user can also select a date for the last registration date but the minimum date is startDate
    $('#batchLastRedDate').daterangepicker({
        "minDate": startDate.toISOString().split('T')[0],
        "singleDatePicker": true,
        "autoApply": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "drops": "up",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });


}

//creating a function to auto generated the batch end date according to the selected commence date
const calculateEndDate = () => {
    //get the batchCommenceDate input value and save it to startDateString variable
    let startDateString = batchCommenceDate.value;
    console.log(startDateString);

    //parse the startDateString from string in to a Date type
    let startDate = new Date(startDateString);
    console.log(startDate);

    //store the duration of the selected course into durationInMonths
    let durationInMonths = newBatch.courseID.duration;

    //set the startDate by adding the durationInMonths
    startDate.setMonth(startDate.getMonth() + durationInMonths);

    // console.log(startDate.toISOString().split('T')[0]);
    //initialize and set the minDate of the batchEndDate to startDate
    //user can also select a date for the end date but the minimum date is startDate
    $('#batchEndDate').daterangepicker({
        "minDate": startDate.toISOString().split('T')[0],
        "singleDatePicker": true,
        "autoApply": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "drops": "up",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });
}

const fillPaymentPlan = () => {
    //clear the commence date / end date and last reg date as well when a course is changed
    let dateInputs = [batchCommenceDate, batchEndDate, batchLastRedDate];
    dateInputs.forEach((input) => {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
        input.value = '';
    })

    let currentCourseId = newBatch.courseID.id;
    console.log(currentCourseId);
    let paymentPlans = ajaxGetRequest("/PaymentPlan/getActivePlans/" + currentCourseId);
    fillSelectOptions(batchPaymentPlan, '', paymentPlans, 'name');
    batchPaymentPlan.setAttribute('data-placeholder','Please Select a Payment Plan');
    $('#batchPaymentPlan').val('').trigger('chosen:updated');

}

const showPaymentPlan = () => {
    paymentPlanRegistrationFee.innerText = "Rs. " + (newBatch.paymentPlanID.registrationFee).toLocaleString('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    paymentPlanCourseFee.innerText = "Rs. " + (newBatch.paymentPlanID.courseFee).toLocaleString('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    paymentPlanTotalFee.innerText = "Rs. " + (newBatch.paymentPlanID.totalFee).toLocaleString('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    paymentPlanInstallments.innerText = newBatch.paymentPlanID.numberOfInstallments;

}

const saveTimetable = () => {
    tblTimetable.classList.remove('d-none');
    let timeTableBody = tblTimetable.querySelector('tbody'); // Select the tbody element
    timeTableBody.innerHTML = '';
    let displayPropertyListForTimeTable =[
        {property: getDay, dataType: 'function'},
        {property: getStartTime, dataType: 'function'},
        {property: getEndTime, dataType: 'function'},
        {property: getLectureRoom, dataType: 'function'},
    ];
    fillDataIntoTableWithDelete(tblTimetable,newBatch.batchHasDayList,displayPropertyListForTimeTable,removeRecord)

}
const getDay =(ob)=>{
    return ob.dayID.name;
}
const getStartTime =(ob)=>{
    return ob.startTime;
}
const getEndTime =(ob)=>{
    return ob.endTime;
}
const getLectureRoom =(ob)=>{
    return ob.lectureRoomID.code;
}

const removeRecord = (ob)=>{
    let extIndex = newBatch.batchHasDayList.map(item=>item.dayID.id).indexOf(ob.dayID.id);
    if(extIndex!=-1){
        newBatch.batchHasDayList.splice(extIndex,1)
        saveTimetable();
    }
}
const addToTimeTable = ()=>{
    let isDuplicate = false;

    // Iterate over each element in the array
    for (let i = 0; i < newBatch.batchHasDayList.length; i++) {
        const existingDay = newBatch.batchHasDayList[i];

        // Compare each property
        if (
            existingDay.dayID.id === batchHasDay.dayID.id &&
            existingDay.startTime === batchHasDay.startTime &&
            existingDay.endTime === batchHasDay.endTime &&
            existingDay.lectureRoomID.id === batchHasDay.lectureRoomID.id
            // Add more properties if needed
        ) {
            // If a match is found, set isDuplicate to true and break out of the loop
            isDuplicate = true;
            break;
        }
    }

    // If it's not a duplicate, add it to the array
    if (!isDuplicate) {
        let errors = checkTimeTableFormErrors();
        if(errors==='') {

            showCustomConfirm("You are about to add a New Class Schedule<br>Are You Sure?", function (result) {
                if(result){
                    newBatch.batchHasDayList.push(batchHasDay);
                    resetTimeTableForm();
                }
                else{
                    showCustomModal("Operation Cancelled!", "info");
                }
            })

        }
        else{
            showCustomModal(errors, 'warning');
        }

    } else {
        // Handle duplicate entry
        console.log("Duplicate entry found. Not added to the array.");
    }
}

const checkTimeTableFormErrors =()=>{
    let errors = '';
    if(batchHasDay.dayID==null){
        errors = errors + 'Day is Required<br>';
        $("#batchClassDay_chosen .chosen-single").addClass('select-invalidated');
        batchClassDay.classList.add('is-invalid');
    }
    if(batchHasDay.startTime==null){
        errors = errors + 'Start Time is Required<br>';
    }
    if(batchHasDay.endTime==null){
        errors = errors + 'End Time is Required<br>';
    }
    if(batchHasDay.lectureRoomID==null){
        errors = errors + 'Lecture Room is Required<br>';
        $("#batchLectureRoom_chosen .chosen-single").addClass('select-invalidated');
        batchLectureRoom.classList.add('is-invalid');
    }
    if(batchHasDay.lecturerID==null){
        errors = errors + 'Lecturer is Required<br>';
        $("#batchLecturer_chosen .chosen-single").addClass('select-invalidated');
        batchLectureRoom.classList.add('is-invalid');
    }
    return errors;
}
//creating a function to submit the batch form when ever needed
const newBatchSubmit = () => {
    console.log(newBatch);
    //calling the checkBatchFormErrors function and catching the return value to errors variable
    let errors = checkBatchFormErrors(newBatch);
    //check the errors variable is null
    //if it's empty that means all the required inputs are filled
    if (errors === '') {
        //get a user confirmation using external customConfirm js
        showCustomConfirm("You are about to add a New Batch<br>Are You Sure?", function (result) {
            if (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                let serviceResponse = ajaxHttpRequest("/Batch", 'POST', newBatch);
                //check the serviceResponse value is "OK"
                if (serviceResponse === "OK") {
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Batch Successfully Added!", "success");
                    //close the offcanvas sheet
                    offCanvasBatchCloseButton.click();
                    //refresh the table
                    refreshBatchTable();
                    //refresh the form
                    resetBatchForm();
                } else {
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
    } else {
        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');

    }
}

//creating a function to edit the batch form when ever needed
const batchEdit = () => {

    //getting the toast from its ID
    var myToastEl = document.getElementById('myToast');
    var myToast = new bootstrap.Toast(myToastEl);
    //Displaying toast
    myToast.show();
    //hide the toast after 5s
    setTimeout(function () {
        myToast.hide();
    }, 5000);

    //display the update button once the edit button is clicked
    btnBatchSheetUpdate.style.display = 'block';

    //remove the attribute readonly to make inputs accept the user input values
    //give a border color to inputs indicate that the input's values are ready to be edited
    inputs = document.querySelectorAll('.batchSheetInputs');

    //remove the disabled attribute from the select
    //give a border color to indicate that select can be now edited

    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
        input.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    });

    batchSheetWeekday.disabled = false;
    if(registrationCount.innerText!=='0'){
        batchSheetPaymentPlan.disabled = true;
        batchSheetPaymentPlan.style = '';
    }

}

//creating a reusable function to check all the required inputs are filled by checking bound values
//need to pass the object as a parameter
//this function will return if there are any unfilled inputs
const checkBatchFormErrors = (batchObject) => {
    let errors = '';

    if (batchObject.courseID == null) {
        errors = errors + 'Course is Required<br>';
        $("#batchCourse_chosen .chosen-single").addClass('select-invalidated');
        batchCourse.classList.add('is-invalid');
    }
    if (batchObject.commenceDate == null) {
        errors = errors + 'Commence Date is Required<br>';
    }
    if (batchObject.endDate == null) {
        errors = errors + 'End Date is Required<br>';
    }
    if (batchObject.lastRegDate == null) {
        errors = errors + 'Last Registration Date is Required<br>';
    }
    if (batchObject.seatCount == null) {
        errors = errors + 'Seat Count is Required<br>';
    }
    if (batchObject.isWeekday == null) {
        errors = errors + 'Delivery Mode is Required<br>';
    }
    if (batchObject.description == null) {
        errors = errors + 'Description is Required<br>';
    }
    if (batchObject.paymentPlanID == null) {
        errors = errors + 'Payment Plan is Required<br>';
        $("#batchPaymentPlan_chosen .chosen-single").addClass('select-invalidated');
        batchPaymentPlan.classList.add('is-invalid');

    }

    if(batchObject.batchHasDayList.length ===0){
        errors = errors + 'Class Schedule is Required<br>';
    }

    return errors;

}

//creating a function to update the privilege when ever needed
const batchUpdate = () => {
    console.log(editedBatch);

    //calling the checkBatchFormErrors function and catching the return value to errors variable
    let errors = checkBatchFormErrors(editedBatch);
    //check the errors variable is null
    //if it's null that means all the required inputs are filled
    if (errors === '') {
        //calling the checkForPrivilegeUpdate function and catching the return value to updates variable
        let updates = checkForBatchUpdate();
        //check the updates variable is null
        //if it's null that means there are no any updates
        if (updates === '') {
            showCustomModal("No changes Detected!", "info");
        } else {
            showCustomConfirm("You are About to Update this Batch<br><br>Following Changes Detected!<br/><br/><small>" + updates + "</small><br>Are You Sure?", function (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                if (result) {
                    //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                    //catch the return value from the backend and save it in the serviceResponse variable
                    let serverResponse = ajaxHttpRequest("/Batch", "PUT", editedBatch);
                    //check the serviceResponse value is "OK"
                    if (serverResponse === "OK") {
                        //this means data successfully passed to the backend
                        //show an alert to user
                        showCustomModal("Batch Successfully Updated!", "success");
                        //close the offCanvas sheet
                        offCanvasBatchSheetCloseButton.click();
                        //refresh table
                        refreshBatchTable();

                    } else {
                        showCustomModal("Operation Failed!" + serverResponse, "error")
                    }


                } else {
                    showCustomModal("Operation Cancelled!", "info");
                }
            });
        }

    } else {
        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');

    }

}

//this function will check for any updates by comparing old and edited Batch object
//this function will return if there are any updates
const checkForBatchUpdate = () => {
    let updates = '';
    if (editedBatch.commenceDate !== oldBatch.commenceDate) {
        updates = updates + "Commence Date was changed to <span class='text-steam-green'>" + editedBatch.commenceDate + "</span><br>";
    }
    if (editedBatch.endDate !== oldBatch.endDate) {
        updates = updates + "End Date was changed to <span class='text-steam-green'>" + editedBatch.endDate + "</span><br>";
    }
    if (editedBatch.lastRegDate !== oldBatch.lastRegDate) {
        updates = updates + "Last Registration Date was changed to <span class='text-steam-green'>" + editedBatch.lastRegDate + "</span><br>";
    }
    if (editedBatch.seatCount !== oldBatch.seatCount) {
        updates = updates + "Seat Count was changed to <span class='text-steam-green'>" + editedBatch.seatCount + "</span><br>";
    }
    if (editedBatch.isWeekday !== oldBatch.isWeekday) {
        if (editedBatch.isWeekday) {
            updates = updates + "Delivery Mode was changed to <span class='text-steam-green'>WeekDay</span><br>";
        } else {
            updates = updates + "Delivery Mode was changed to <span class='text-steam-green'>Weekend</span><br>";
        }

    }
    if (editedBatch.description !== oldBatch.description) {
        updates = updates + "Description was changed to <span class='text-steam-green'>" + editedBatch.description + "</span><br>";
    }
    if (editedBatch.batchStatusID.name !== oldBatch.batchStatusID.name) {
        updates = updates + "Batch Staus was changed to <span class='text-steam-green'>" + editedBatch.batchStatusID.name + "</span><br>";
    }
    if (editedBatch.paymentPlanID.name !== oldBatch.paymentPlanID.name) {
        updates = updates + "Payment Plan was changed to <span class='text-steam-green'>" + editedBatch.paymentPlanID.name + "</span><br>";
    }


    return updates;
}

//creating a function to delete a batch when ever needed
const batchDelete = () => {
    //get user confirmation
    showCustomConfirm("You are About to <b>Delete</b> this Batch<br><br>Batch Code: <span class='text-steam-green'>" + oldBatch.batchCode + "</span><br><br>Are You Sure?", function (result) {
        if (result) {
            //pass the record to backend
            //receive the server response
            let serviceResponse = ajaxHttpRequest("/Batch", "DELETE", oldBatch);
            if (serviceResponse === "OK") {
                //show user the response
                showCustomModal("Batch Successfully Deleted!", "success");
                //close the offCanvas sheet
                offCanvasBatchSheetCloseButton.click();
                //refresh table
                refreshBatchTable();
            } else {
                showCustomModal("Operation Failed!" + serviceResponse, "error");
            }


        } else {
            showCustomModal("Operation Cancelled!", "info");
        }

    });

}

//creating a function to search a batch when ever needed
const batchSearch = () => {
    //save the batchSearchID input value to the variable searchText
    const searchText = batchSearchID.value;
    //check if the searchText contain a value or not
    if (searchText !== '') {
        //searchText contains a value
        //pass the request to backend and catch the result into searchBatch variable
        let searchBatch = ajaxGetRequest("/Batch/getBatchInfo/" + searchText);
        //refill the tblBatch with the received response from the backend
        fillDataIntoTable(tblBatch, searchBatch, displayPropertyListForBatches, rowView, 'offcanvasBatchSheet');

    } else {
        //this means searchText doesn't contain a value (empty)
        //inform the user using showCustomModal function
        showCustomModal("Batch Code is required for a search", "warning");
    }
}

//creating a function to reset the search bar when ever needed
const batchSearchReset = () => {
    //set the search bar value to empty
    batchSearchID.value = '';
    //refresh the table using refreshBatchTable function
    refreshBatchTable();

}

const resetPaymentPlanForm = ()=>{
    inputs = document.querySelectorAll('.newPaymentPlanInputs');
    inputs.forEach(function (input) {
        //remove the inline css from inputs
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    newPaymentPlan = {}
    frmAddNewModule.reset();

    fillSelectOptions(paymentPlanCourse,' ',courses,'name');
    $('#paymentPlanCourse').chosen({width:'100%'});
}