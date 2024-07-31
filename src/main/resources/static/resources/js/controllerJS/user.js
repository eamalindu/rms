window.addEventListener('load',()=>{
    //refresh the user table
    refreshUserTable();
    //reset the user form
    resetUserForm()

    //validation chosen select (for new User)
    $("#userEmployee").chosen().change(function () {
        $("#userEmployee_chosen .chosen-single").addClass('select-validated');
    });

    //validation for multi select chosen
    $("#userRole").chosen().change(function () {
        $("#userRole_chosen .chosen-choices").addClass('select-validated');
        $("#userRole_chosen .search-choice").addClass('select-validated');
    });

});

//creating a function to refresh the user table when ever needed
const refreshUserTable = ()=>{

    //getting current users from the database using ajaxGetRequest function and assign the response to the variable users
    users = ajaxGetRequest("/User/findall");

    //creating a display property list for the users
    displayPropertyListForUser = [
        {property:getEmployeeID,dataType:'function'},
        {property:getEmployeeCallingName,dataType:'function'},
        {property:'username',dataType:'text'},
        {property:'email',dataType:'text'},
        {property:getRoles,dataType:'function'},
        {property:getStatus,dataType:'function'},
    ];
    //calling external common function to fill the data into the table
    fillDataIntoTable(tblUser,users,displayPropertyListForUser,rowView,'offcanvasUserSheet')

    //initialize dataTable if data is available
    if(users.length!==0){
        $('#tblUser').dataTable();
    }
}

//since we cant access the employee ID from the users directly. creating a function to return the employeeID from the user object
const getEmployeeID = (ob)=>{
    return ob.employeeID.employeeID;
}
//since we cant access the employee calling name from the users directly. creating a function to return the calling name from the user object
const getEmployeeCallingName = (ob)=>{
    return ob.employeeID.callingName;
}
//user roles have one or more data inside them, to access every one of the creating a function
const getRoles = (ob)=>{
    //creating a variable to set the roles
    let userRoles ='';
    //using a forEach loop access the elements inside the roles array
    ob.roles.forEach((element,index)=>{
        //check if roles only have one data
        if(ob.roles.length-1==index) {
            userRoles = userRoles + element.name;
        }
        //this means there are more than one data
        else{
            userRoles = userRoles + element.name+", ";
        }
    });

    //returning captured roles
    return userRoles;
}

//since the status data type is in boolean we cant show true or false in the table
//crated a function to return Active and Inactive based on their value
const getStatus = (ob) => {
    if (ob.status === true) {
        return '<span class="badge rounded-0" style="background: #3FB618">Active</span>';
    } else {
        return '<span class="badge rounded-0" style="background: #FF0039">Inactive</span>'
    }
}

//created a function to show to details in an offcanvas
const rowView = (ob,rowIndex)=>{

    //add the attribute disabled to make inputs block the user input values
    //remove the edited border colors from the inputs
    inputs = document.querySelectorAll('.userSheetInputs');
    inputs.forEach(function (input) {
        input.setAttribute('disabled', 'true');
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //remove the class 'select-editable' from chosen select (multi select in this case)
    $("#userSheetRole_chosen .chosen-choices").removeClass('select-editable');
    $("#userSheetRole_chosen .search-choice").removeClass('select-editable');
    $("#userSheetRole_chosen .chosen-choices").removeClass('select-validated');
    $("#userSheetRole_chosen .search-choice").removeClass('select-validated');
    userSheetRole.classList.remove('is-valid');

    //setting object values in to the inputs
    userSheetEmail.value = ob.email;
    userSheetEmpNumber.value=ob.employeeID.employeeID;
    userSheetCallingName.value=ob.employeeID.callingName;
    userSheetUsername.value = ob.username;

    //hide the update btn
    btnUserSheetUpdate.style.display = 'none';
    fillMultiSelectOptions(userSheetRole,'',roles,'name',ob.roles)
    $('#userSheetRole').chosen({width:'100%',placeholder_text_multiple: "Please Select At Least One Role"});
    $('#userSheetRole').prop('disabled', true).trigger("chosen:updated");

    //check the value of the status and set the values accordingly
    if(ob.status){
        userSheetStatus.checked = true;
        textUserSheetStatus.innerText = 'Active';
    }
    else{
        userSheetStatus.checked = false;
        textUserSheetStatus.innerText = 'Not Active';
    }

    //catch old User and new User
    oldUser = JSON.parse(JSON.stringify(ob));
    editedUser = JSON.parse(JSON.stringify(ob));
}

//creating a function to reset the user form when ever needed
const resetUserForm = ()=>{

    //remove validation from chosen select
    $("#userEmployee_chosen .chosen-single").removeClass('select-validated');
    $("#userRole_chosen .chosen-choices").removeClass('select-validated');
    $("#userRole_chosen .search-choice").removeClass('select-validated');
    $("#userEmployee_chosen .chosen-single").removeClass('select-invalidated');
    $("#userRole_chosen .chosen-choices").removeClass('select-invalidated');
    $("#userRole_chosen .search-choice").removeClass('select-invalidated');
    userEmployee.classList.remove('is-valid');
    userRole.classList.remove('is-valid');
    userEmployee.classList.remove('is-invalid');
    userRole.classList.remove('is-invalid');



    //set default option chosen
    setTimeout(function () {
        $('#userRole').val('').trigger('chosen:updated');
        $('#userEmployee').val('').trigger('chosen:updated');
    }, 0);

    //reset form
    frmNewUser.reset();

    //remove validation from the inputs all at once
    inputs = document.querySelectorAll('.newUserInputs');
    inputs.forEach(function (input) {
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //set the text of the label to 'Not Active'
    textUserStatus.innerText = 'Not Active'

    //dynamic select content handling
    employeesWithoutUserAccounts = ajaxGetRequest("/Employee/GetEmployeesWithoutUserAccount");
    fillSelectOptions(userEmployee, 'Please Select an Employee', employeesWithoutUserAccounts, 'fullName');
    roles = ajaxGetRequest("/role/findall");
    fillSelectOptions(userRole, '', roles, 'name');

    //initialize the 3rd party libraries (chosen)
    $('#userEmployee').chosen({width:'100%'});
    $('#userRole').chosen({width:'100%',placeholder_text_multiple: "Please Select At Least One Role",min_selected_options:1});
    //reset user object
    newUser = {}
    //reset user roles array
    newUser.roles= [];

}
//creating a function to submit the privilege form when ever needed
const newUserSubmit = ()=>{

    console.log("new User=>")
    console.log(newUser);

    let errors = checkUserFormErrors(newUser,userPassword,userConfirmPassword);
    if(errors===''){
        showCustomConfirm("You are about to add a New User<br>Are You Sure?", function (result) {
            if (result) {
                serviceResponse = ajaxHttpRequest("/User",'POST',newUser);

                if(serviceResponse==="OK"){

                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("User Successfully Added!", "success");
                    offCanvasUserCloseButton.click();
                    refreshUserTable();
                    resetUserForm();
                }
                else{

                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed!" + serviceResponse, "error");
                }

            }
            else{
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
//creating a function to compare password
const checkPassword=()=>{
    password = userPassword.value;
    confirmPassword= userConfirmPassword.value;

    if(password!=''){

        if(password!=confirmPassword){
            userConfirmPassword.classList.add('is-invalid')
            userConfirmPassword.classList.remove('is-valid')
            userConfirmPassword.style.border = '1px solid red';
            userConfirmPassword.style.color='red';
            userConfirmPassword.style.background = 'white';
            userConfirmPassword.style.paddingRight = '0';

        }
        else{
            userPassword.classList.add('is-valid')
            userConfirmPassword.classList.add('is-valid')
            userPassword.classList.remove('is-invalid')
            userConfirmPassword.classList.remove('is-invalid')
            userPassword.style.border = '1px solid green';
            userPassword.style.color='green';
            userPassword.style.background = 'white';
            userPassword.style.paddingRight = '0';

            userConfirmPassword.style.border = '1px solid green';
            userConfirmPassword.style.color='green';
            userConfirmPassword.style.background = 'white';
            userConfirmPassword.style.paddingRight = '0';

        }

    }
    else{
        userPassword.focus()
        userPassword.classList.add('is-invalid')
    }
}
//creating a reusable function to check all the required inputs are filled by checking bound values
//need to pass the object as a parameter
//this function will return if there are any unfilled inputs
const checkUserFormErrors = (userObject,passwordID,confirmPasswordID)=> {
    let errors = '';

    if(userObject.employeeID==null){
        errors = errors +'Employee is Required<br>';
        $("#userEmployee_chosen .chosen-single").addClass('select-invalidated');
        userEmployee.classList.add('is-invalid');
    }
    if(userObject.username==null){
        errors = errors +'Username is Required<br>';
        userUsername.style.borderColor = 'red';
        userUsername.classList.add('is-invalid');
    }
    if(userObject.email==null){
        errors = errors +'Email is Required<br>';
        userEmail.style.borderColor = 'red';
        userEmail.classList.add('is-invalid');
    }
    if(userObject.password==null){
        errors = errors +'Password is Required<br>';
        userPassword.style.borderColor = 'red';
        userPassword.classList.add('is-invalid');
    }
    if(userObject.roles.length===0){
        errors = errors +'Role(s) is Required<br>';
        $("#userRole_chosen .chosen-choices").addClass('select-invalidated');
        $("#userRole_chosen .search-choice").addClass('select-invalidated');
        userRole.classList.add('is-invalid');
    }
    if(userObject.status==null){
        errors = errors +'Status is Required<br>';
    }

    if(passwordID.value !== confirmPasswordID.value){
        errors =errors +'Passwords Does not Match<br>';
    }

    return errors;
}
//creating a function to edit the User form when ever needed
const userEdit=()=>{
    //display the update button once the edit button is clicked
    btnUserSheetUpdate.style.display = 'block';
    //remove the attribute readonly to make inputs accept the user input values
    //give a border color to inputs indicate that the input's values are ready to be edited
    inputs = document.querySelectorAll('.userSheetInputs');
    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
        input.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    });
    $('#userSheetRole').prop('disabled', false).trigger("chosen:updated");
    $("#userSheetRole_chosen .chosen-choices").addClass('select-editable');
    $("#userSheetRole_chosen .search-choice").addClass('select-editable');

    $("#userSheetRole").chosen().change(function () {
        $("#userSheetRole_chosen .chosen-choices").removeClass('select-editable');
        $("#userSheetRole_chosen .search-choice").removeClass('select-editable');
        $("#userSheetRole_chosen .chosen-choices").addClass('select-validated');
        $("#userSheetRole_chosen .search-choice").addClass('select-validated');
    });

}
//creating a function to update the User when ever needed
const userUpdate=()=>{
    console.log(oldUser)
    console.log(editedUser)

    let errors = checkUserFormErrors(editedUser,'','');
    if (errors === '') {
        //check for updates
        let updates = checkForUserUpdate();
        if (updates === '') {
            showCustomModal("No changes Detected!", "info");
        } else {
            showCustomConfirm("You are About to Update this User<br><br>Following Changes Detected!<br/><br/><small>" + updates + "</small><br>Are You Sure?",function (result){
                if(result){
                    let serverResponse = ajaxHttpRequest("/User","PUT",editedUser);
                    if(serverResponse === "OK"){
                        //show user success message
                        showCustomModal("User Updated!",'success')
                        //refresh table
                        refreshUserTable();
                        //close the offcanvas
                        offCanvasUserSheetCloseButton.click();
                    }
                    else{
                        showCustomModal("Update Failed!",'error')
                    }

                }
                else{
                    showCustomModal("Operation Cancelled!", "info");
                }

            })


        }
    }
    else{
        showCustomModal(errors, 'warning');
    }
}

//this function will check for any updates by comparing old and edited User object
//this function will return if there are any updates
const checkForUserUpdate=()=>{
    let updates = '';
    if(editedUser.username!==oldUser.username){
        updates = updates + "Username was changed to <span class='text-purple'>" + editedUser.username + "</span><br>";
    }
    if(editedUser.email!==oldUser.email){
        updates = updates + "Email was changed to <span class='text-purple'>" + editedUser.email + "</span><br>";
    }
    if(editedUser.status!==oldUser.status){

        if(editedUser.status){
            updates = updates + "Account Status was changed to <span class='text-purple'>Active</span><br>";
        }
        else{
            updates = updates + "Account Status was changed to <span class='text-purple'>Inactive</span><br>";
        }

    }
    if(editedUser.roles.length!==oldUser.roles.length){
        updates = updates+"User Role was change<br>";
    }
    else{
        let equalCount = 0;
        for (i=0;i<editedUser.roles.length;i++) {

            for (j=0;j<oldUser.roles.length;j++){
                if(editedUser.roles[i].name===oldUser.roles[j].name){
                    equalCount = equalCount+1;
                    break;
                }

            }
        }
        if(equalCount!==editedUser.roles.length){
            updates = updates+"User Role was change<br>";
        }


    }

    return updates;

}
//creating a function to delete a user when ever needed
const userDelete = ()=>{

    //get user confirmation
    showCustomConfirm("You are About to Delete this User<br><br>Username: <span class='text-purple'>"+oldUser.username+"</span><br><br>Are You Sure?",function (result) {
        if(result){
            //pass the record to backend
            //receive the server response
            let serviceResponse = ajaxHttpRequest("/User","DELETE",oldUser);
            if(serviceResponse==="OK"){
                //show user the response
                showCustomModal("User Successfully Deleted!", "success");
                //close the offCanvas sheet
                offCanvasUserSheetCloseButton.click();
                //refresh table
                refreshUserTable();
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