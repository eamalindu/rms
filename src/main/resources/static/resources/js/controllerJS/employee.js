window.addEventListener('load',()=>{

    refreshEmployeeTable()
    resetEmployeeForm()

    //hide the update btn
    btnEmployeeSheetUpdate.style.display = 'none';

    $('#employeeSheetDOB').daterangepicker({
        "maxDate": new Date(),
        "singleDatePicker": true,
        "timePicker": false,
        "timePicker24Hour": true,
        "autoApply": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "drops": "up",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });

    //bind data to the student object, once the "apply" button on studentDOB input is clicked
    $('#employeeDOB').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        //using inputTextValidator function to validate the input
        inputTextValidator(this, '^(19[89][0-9]|20[0-9]{2})[-][0-9]{2}[-][0-9]{2}$', 'newEmployee', 'dob');

    });
    //when apply is clicked data will validate and bind to the editedInquiry object
    $('#employeeSheetDOB').on('apply.daterangepicker',function (){
        inputTextValidator(this,'^20[0-9]{2}[-][0-9]{2}[-][0-9]{2}$','editedEmployee','dob')
    });

    //validation chosen select (for new employee)
    $("#employeeCallingName").chosen().change(function () {
        $("#employeeCallingName_chosen .chosen-single").addClass('select-validated');
    });
    $("#employeeCivilStatus").chosen().change(function () {
        $("#employeeCivilStatus_chosen .chosen-single").addClass('select-validated');
    });
    $("#employeeDesignation").chosen().change(function () {
        $("#employeeDesignation_chosen .chosen-single").addClass('select-validated');
    });
    $("#employeeHighestEducation").chosen().change(function () {
        $("#employeeHighestEducation_chosen .chosen-single").addClass('select-validated');
    });
})

const refreshEmployeeTable = ()=>{
    employees = ajaxGetRequest("/Employee/findall");
    displayPropertyListForEmployee = [
        {property:'employeeID',dataType:'text'},
        {property:'fullName',dataType:'text'},
        {property:'nic',dataType:'text'},
        {property:'mobileNumber',dataType:'text'},
        {property:getDesignationName,dataType:'function'},
        {property:getEmployeeStatus,dataType:'function'},
        {property:getUserAccountStatus,dataType:'function'},
    ];

    fillDataIntoTable(tblEmployee,employees,displayPropertyListForEmployee,rowView,'offCanvasEmployeeSheet')
    $('#tblEmployee').DataTable();
}

const getDesignationName = (ob)=>{

    return ob.designationID.designation;
}
const getEmployeeStatus = (ob)=>{
    if(ob.employeeStatusID.status=="Working"){
        return '<i class="fa-solid fa-user-check text-success bg-custom-white p-2 rounded-circle" title="Employee Working"></i>';
    }
    if(ob.employeeStatusID.status=="Suspended"){
        return '<i class="fa-solid fa-user-slash text-warning bg-custom-white p-2 rounded-circle" title="Employee Suspended"></i>';
    }
    if(ob.employeeStatusID.status=="Resigned"){
        return '<i class="fa-solid fa-user-xmark fa-solid fa-user-xmark text-danger bg-custom-white p-2 rounded-circle" title="Employee Resigned"></i>';
    }

}

const getUserAccountStatus = (ob)=>{
    return '<span class="badge rounded-0" style="background: #3FB618">Created</span>';
}

const rowView=(ob,index) =>{

    inputs = document.querySelectorAll('.employeeSheetInputs');

    //remove the disabled attribute from the select
    //give a border color to indicate that select can be now edited

    inputs.forEach(function (input) {
        input.setAttribute('disabled', 'true');
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    employeeSheetCallingNameText.classList.remove('text-muted');
    employeeSheetCallingNameText.classList.remove('text-warning');
    employeeSheetCallingNameText.classList.remove('text-danger');

    //hide the update btn
    btnEmployeeSheetUpdate.style.display = 'none';

    employeeSheetFullName.value = ob.fullName;
    employeeSheetCallingName.value = ob.callingName;
    employeeSheetNIC.value =ob.nic;
    employeeSheetDOB.value =ob.dob;

    employeeSheetImage.src = 'data:image/png;base64,'+ob.photoPath;

    //setting gender
    if(ob.gender=="Male"){
        employeeSheetGenderMale.checked = true;
    }
    else{
        employeeSheetGenderFemale.checked = true;
    }

    employeeSheetEmail.value=ob.email;
    employeeSheetMobile.value = ob.mobileNumber;

    //setting optional values
    if (ob.landNumber !== null) {
        employeeSheetLand.value = ob.landNumber;
        employeeSheetLand.classList.remove('text-muted');

    } else {
        employeeSheetLand.value = '-- Not Provided --';
        employeeSheetLand.classList.add('text-muted');
    }
    employeeSheetAddress.value = ob.address;

    employeeSheetCivilStatus.value = ob.civilStatus;

    const Status = ajaxGetRequest("/employeestatus/findall")
    //select the appropriate option as selected
    fillSelectOptions(employeeSheetDesignation, 'Please Select a Designation', designations, 'designation',ob.designationID.designation)
    fillSelectOptions(employeeSheetEmployeeStatus, 'Please Select a Status', Status, 'status',ob.employeeStatusID.status)

//setting optional values
    if (ob.note !== null) {
        employeeSheetNote.value = ob.note;
        employeeSheetNote.classList.remove('text-muted');

    } else {
        employeeSheetNote.value = '-- Not Provided --';
        employeeSheetNote.classList.add('text-muted');
    }

    employeeSheetHighestEducation.value = ob.highestEducationalQualification;

    employeeSheetEmpIDText.innerText = ob.employeeID;

    const [joinedDate, joinedTime] =ob.added_timestamp.split("T");
    employeeSheetJoinedDateText.innerText = joinedDate;

    employeeSheetCallingNameText.innerText = ob.callingName;

    if(ob.employeeStatusID.status=="Working") {
        employeeSheetCallingNameText.classList.add('text-success');
    }
    else if (ob.employeeStatusID.status=="Suspended"){
        employeeSheetCallingNameText.classList.add('text-warning');
    }
    else{
        employeeSheetCallingNameText.classList.add('text-danger');
    }

    //catch old Employee and new Employee
    oldEmployee = JSON.parse(JSON.stringify(ob));
    editedEmployee = JSON.parse(JSON.stringify(ob));
}
const employeeEdit = () => {

    //display the update button once the edit button is clicked
    btnEmployeeSheetUpdate.style.display = 'block';

    //remove the attribute readonly to make inputs accept the user input values
    //give a border color to inputs indicate that the input's values are ready to be edited
    inputs = document.querySelectorAll('.employeeSheetInputs');

    //remove the disabled attribute from the select
    //give a border color to indicate that select can be now edited

    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
        input.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    });

}

const newEmployeeSubmit=()=>{
    console.log(newEmployee);

    const errors = checkEmployeeFormErrors(newEmployee)

    if(errors===''){
        //this means there are no any errors
        //user confirmation is needed (will add later)
        showCustomConfirm("You are about to add a New Employee<br>Are You Sure?", function (result) {
            if (result) {
                //passing the data to backend
                //if the data is successfully passed to the database it will set the value of the postServerResponse to "OK"
                let postServerResponse;
                $.ajax("/Employee", {
                    type: "POST",
                    async: false, // set the async option false to wait for the response
                    contentType: "application/json",
                    data: JSON.stringify(newEmployee),
                    success: function (data) {
                        console.log("success " + data);
                        postServerResponse = data;

                    }, error: function (resOb) {
                        console.log("Error " + resOb);
                        postServerResponse = resOb;

                    }
                });
                if (postServerResponse === 'OK') {

                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Employee Successfully Added!", "success");

                    //trigger offcanvas button
                    offCanvasEmployeeCloseButton.click();

                    //needs to refresh all the tables in the employee
                    refreshEmployeeTable();
                    resetEmployeeForm();


                } else {
                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed!" + postServerResponse, "error");
                }

            } else {
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

const employeeUpdate = ()=>{
    console.log(oldEmployee)
    console.log(editedEmployee)

    //check required values
    const errors = checkEmployeeFormErrors(editedEmployee);
    if (errors === '') {

        //check for updates
        let updates = checkForEmployeeUpdate();

        if(updates===''){
            showCustomModal("No changes Detected!", "info");
        }
        else{
            showCustomConfirm("You are About to Update this Employee<br><br>Following Changes Detected!<br/><br/><small>" + updates+"</small><br>Are You Sure?", function (result){

                if(result){
                    //database ajax code
                    let postServerResponse;
                    $.ajax("/Employee", {
                        type: "PUT",
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify(editedEmployee),
                        success: function (data) {
                            console.log("success " + data);
                            postServerResponse = data;
                        },
                        error: function (resOb) {
                            console.log("Error " + resOb);
                            postServerResponse = resOb;
                        }
                    });
                    //if data passed successfully
                    //show a success alert
                    if(postServerResponse === "OK"){

                        showCustomModal("Employee Successfully Updated!","success")
                        //close the offCanvas and refresh the table
                        offCanvasEmployeeSheetCloseButton.click();
                        refreshEmployeeTable();

                    }

                        //if data passed unsuccessfully
                    //show an error alert
                    else
                    {
                        showCustomModal("Operation Failed! <br> Employee Record Not Updated! "+postServerResponse,"error")
                    }
                }
                else{
                    showCustomModal("Operation Cancelled!", "info");
                }
            });

        }
    }
    else{
        showCustomModal(errors, 'warning');
    }

}

const checkEmployeeFormErrors = (employeeObject)=>{
    let errors = '';

    if(employeeObject.fullName==null){
        errors = errors +'Full Name is Required<br>';
        employeeFullName.style.borderColor = 'red';
        employeeFullName.classList.add('is-invalid');
    }
    if(employeeObject.nic==null){
        errors = errors +'NIC is Required<br>';
        employeeNIC.style.borderColor = 'red';
        employeeNIC.classList.add('is-invalid');
    }
    if(employeeObject.dob==null){
        errors = errors +'Date of Birth is Required<br>';
        employeeDOB.style.borderColor = 'red';
        employeeDOB.classList.add('is-invalid');
    }
    if(employeeObject.email==null){
        errors = errors +'Email is Required<br>';
        employeeEmail.style.borderColor = 'red';
        employeeEmail.classList.add('is-invalid');
    }
    if(employeeObject.mobileNumber==null){
        errors = errors +'Mobile Number is Required<br>';
        employeeMobile.style.borderColor = 'red';
        employeeMobile.classList.add('is-invalid');
    }
    if(employeeObject.address==null){
        errors = errors +'Address is Required<br>';
        employeeAddress.style.borderColor = 'red';
        employeeAddress.classList.add('is-invalid');
    }
    if(employeeObject.civilStatus==null){
        errors = errors +'Civil Status is Required<br>';
        $("#employeeCivilStatus_chosen .chosen-single").addClass('select-invalidated');
        employeeCivilStatus.classList.add('is-invalid');

    }
    if(employeeObject.designationID==null){
        errors = errors +'Designation is Required<br>';
        $("#employeeDesignation_chosen .chosen-single").addClass('select-invalidated');
        employeeDesignation.classList.add('is-invalid');
    }
    if(employeeObject.gender==null){
        errors = errors +'Gender is Required<br>';
    }
    if(employeeObject.callingName==null){
        errors = errors +'Calling Name is Required<br>';
        $("#employeeCallingName_chosen .chosen-single").addClass('select-invalidated');
        employeeCallingName.classList.add('is-invalid');
    }
    if(employeeObject.photoPath==null){
        errors = errors +'Profile Photo is Required<br>';
        employeeProfile.style.borderColor = 'red';
        employeeProfile.classList.add('is-invalid');

    }
    if(employeeObject.highestEducationalQualification==null){
        errors = errors +'Highest Educational Qualification is Required<br>';
        $("#employeeHighestEducation_chosen .chosen-single").addClass('select-invalidated');
        employeeHighestEducation.classList.add('is-invalid');
    }

    return errors;
}

//function to compare the old and edited employee values and return the updated/changed values
const checkForEmployeeUpdate = ()=>{
    let updates = '';

    if (editedEmployee.fullName !== oldEmployee.fullName) {
        updates = updates + "Full Name was changed to <span class='text-purple'>" + editedEmployee.fullName + "</span><br>";
    }
    if (editedEmployee.nic !== oldEmployee.nic) {
        updates = updates + "NIC was changed to <span class='text-purple'>" + editedEmployee.nic + "</span><br>";
    }
    if (editedEmployee.gender !== oldEmployee.gender) {
        updates = updates + "Gender was changed to <span class='text-purple'>" + editedEmployee.gender + "</span><br>";
    }
    if (editedEmployee.dob !== oldEmployee.dob) {
        updates = updates + "DOB was changed to <span class='text-purple'>" + editedEmployee.dob + "</span><br>";
    }
    if (editedEmployee.email !== oldEmployee.email) {
        updates = updates + "Email was changed to <span class='text-purple'>" + editedEmployee.email + "</span><br>";
    }
    if (editedEmployee.mobileNumber !== oldEmployee.mobileNumber) {
        updates = updates + "Mobile Number was changed to <span class='text-purple'>" + editedEmployee.mobileNumber + "</span><br>";
    }
    if (editedEmployee.landNumber !== oldEmployee.landNumber) {
        updates = updates + "Land Number was changed to <span class='text-purple'>" + editedEmployee.landNumber + "</span><br>";
    }
    if (editedEmployee.address !== oldEmployee.address) {
        updates = updates + "Address was changed to <span class='text-purple'>" + editedEmployee.address + "</span><br>";
    }
    if (editedEmployee.highestEducationalQualification !== oldEmployee.highestEducationalQualification) {
        updates = updates + "Qualification was changed to <span class='text-purple'>" + editedEmployee.highestEducationalQualification + "</span><br>";
    }
    if (editedEmployee.civilStatus !== oldEmployee.civilStatus) {
        updates = updates + "Civil Status was changed to <span class='text-purple'>" + editedEmployee.civilStatus + "</span><br>";
    }
    if (editedEmployee.designationID.designation !== oldEmployee.designationID.designation) {
        updates = updates + "Designation was changed to <span class='text-purple'>" + editedEmployee.designationID.designation + "</span><br>";
    }
    if (editedEmployee.employeeStatusID.status !== oldEmployee.employeeStatusID.status) {
        updates = updates + "Employee Status was changed to <span class='text-purple'>" + editedEmployee.employeeStatusID.status + "</span><br>";
    }
    if (editedEmployee.note !== oldEmployee.note) {
        updates = updates + "Note was changed to <span class='text-purple'>" + editedEmployee.note + "</span><br>";
    }

    return updates;

}

const resetEmployeeForm = ()=>{

    $("#employeeCivilStatus_chosen .chosen-single").removeClass('select-validated');
    $("#employeeDesignation_chosen .chosen-single").removeClass('select-validated');
    $("#employeeHighestEducation_chosen .chosen-single").removeClass('select-validated');
    $("#employeeCallingName_chosen .chosen-single").removeClass('select-validated');
    $("#employeeCivilStatus_chosen .chosen-single").removeClass('select-invalidated');
    $("#employeeDesignation_chosen .chosen-single").removeClass('select-invalidated');
    $("#employeeHighestEducation_chosen .chosen-single").removeClass('select-invalidated');
    $("#employeeCallingName_chosen .chosen-single").removeClass('select-invalidated');
    employeeCivilStatus.classList.remove('is-valid');
    employeeDesignation.classList.remove('is-valid');
    employeeHighestEducation.classList.remove('is-valid');
    employeeCallingName.classList.remove('is-valid');
    employeeCivilStatus.classList.remove('is-invalid');
    employeeDesignation.classList.remove('is-invalid');
    employeeHighestEducation.classList.remove('is-invalid');
    employeeCallingName.classList.remove('is-invalid');

    //set default option chosen
    setTimeout(function () {
        $('#employeeCivilStatus').val('').trigger('chosen:updated');
        $('#employeeDesignation').val('').trigger('chosen:updated');
        $('#employeeCallingName').val('').trigger('chosen:updated');
        $('#employeeHighestEducation').val('').trigger('chosen:updated');
    }, 0);

    //remove value
    document.getElementById('frmNewEmployee').reset();
    //removing image
    imgProfile.src="";
    imgProfile.classList.remove('bg-success');
    //remove validation
    inputs = document.querySelectorAll('.newEmployeeInputs');
    inputs.forEach(function (input) {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });
    //new employee object
    newEmployee = {};

    checkBoxValidator(this, leftMale, rightFemale, 'newEmployee', 'gender', 'Female', 'Male');

    //dynamic select for sources
    designations = ajaxGetRequest("/designation/findall")
    fillSelectOptions(employeeDesignation, ' ', designations, 'designation')

    $('#employeeDesignation').chosen({width: '100%'});
    $('#employeeCivilStatus').chosen({width: '100%'});
    $('#employeeHighestEducation').chosen({width:'100%'});
    $('#employeeCallingName').chosen({width:'100%'});

    //initializing 3rd party libraries
    $('#employeeDOB').daterangepicker({
        "drops": "up",
        "singleDatePicker": true,
        "showDropdowns": true,
        "autoUpdateInput": false,
        maxDate: new Date(),
        locale: {
            format: 'YYYY-MM-DD'
        }
    });
}

//creating a function to delete an employee when ever needed
const employeeDelete = ()=>{
    //get user confirmation
    showCustomConfirm("You are About to Delete this Employee<br><br>Employee Name: <span class='text-purple'>"+oldEmployee.callingName+"</span><br><br>Are You Sure?",function (result) {
        if(result){
            //pass the record to backend
            //receive the server response
            let serviceResponse = ajaxHttpRequest("/Employee","DELETE",oldEmployee);
            if(serviceResponse==="OK"){
                //show user the response
                showCustomModal("Employee Successfully Deleted!", "success");
                //close the offCanvas sheet
                offCanvasEmployeeSheetCloseButton.click();
                //refresh table
                refreshEmployeeTable();
            }
            else{
                showCustomModal("Operation Failed!" + serviceResponse, "error");
            }
        }
        else{
            showCustomModal("Operation Cancelled!", "info");
        }
    });

}


const generateCallingName = ()=>{
    const fullName=employeeFullName.value
    const nameParts = fullName.split(" ");
    employeeCallingName.innerHTML = '';
    nameParts.forEach(namePart=>{
        const option = document.createElement('option');
        option.innerText = namePart;
        option.value= namePart;
        employeeCallingName.appendChild(option);
    })
    $('#employeeCallingName').val('').trigger('chosen:updated');
    console.log(nameParts)
}