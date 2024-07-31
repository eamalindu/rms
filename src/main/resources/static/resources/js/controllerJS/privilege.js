window.addEventListener('load', () => {
    //refresh the privilege table
    refreshPrivilegeTable();
    //reset the privilege form
    resetPrivilegeForm()

    //validation chosen select (for new Privilege)
    $("#privilegeRole").chosen().change(function () {
        $("#privilegeRole_chosen .chosen-single").addClass('select-validated');
    });
    $("#privilegeModule").chosen().change(function () {
        $("#privilegeModule_chosen .chosen-single").addClass('select-validated');
    });
});


//creating a function to refresh the privilege table when ever needed
const refreshPrivilegeTable = ()=>{

    //getting current privilege from the database using ajaxGetRequest function and assign the response to the variable privileges
    privileges = ajaxGetRequest("/Privilege/findall");
    //creating a display property list for the privileges
    displayPropertyListForPrivilege = [
        {property:getRoleName,dataType:'function'},
        {property:getModuleName,dataType:'function'},
        {property:getSelect,dataType:'function'},
        {property:getInsert,dataType:'function'},
        {property:getUpdate,dataType:'function'},
        {property:getDelete,dataType:'function'},]

    //calling external common function to fill the data into the table
    fillDataIntoTable(tblPrivilege,privileges,displayPropertyListForPrivilege,rowView,'offcanvasPrivilegeSheet')

    //initialize dataTable if data is available
    if(privileges.length!==0){
        $('#tblPrivilege').dataTable();
    }

}
//since we cant access the Role Name from the privileges directly. creating a function to return the roleID from the privileges object
const getRoleName=(ob)=>{

    return ob.roleID.name;
}
//since we cant access the module Name from the privileges directly. creating a function to return the moduleID from the privileges object
const getModuleName=(ob)=>{

    return ob.moduleID.name;
}
//since the select data type is in boolean we cant show true or false in the table
//crated a function to return Granted and Not Granted based on their value
const getSelect = (ob) => {
  if(ob.selectPrivilege){
      return '<span class="badge rounded-0" style="background: #3FB618">Granted</span>';
  } else {
        return '<span class="badge rounded-0" style="background: #FF0039">Not Granted</span>';
  }
}

//since the insert data type is in boolean we cant show true or false in the table
//crated a function to return Granted and Not Granted based on their value
const getInsert = (ob) => {
    if(ob.insertPrivilege){
        return '<span class="badge rounded-0" style="background: #3FB618">Granted</span>';
    } else {
        return '<span class="badge rounded-0" style="background: #FF0039">Not Granted</span>';
    }
}

//since the update data type is in boolean we cant show true or false in the table
//crated a function to return Granted and Not Granted based on their value
const getUpdate = (ob) => {
    if(ob.updatePrivilege){
        return '<span class="badge rounded-0" style="background: #3FB618">Granted</span>';
    } else {
        return '<span class="badge rounded-0" style="background: #FF0039">Not Granted</span>';
    }
}

//since the delete data type is in boolean we cant show true or false in the table
//crated a function to return Granted and Not Granted based on their value
const getDelete = (ob) => {
    if(ob.deletePrivilege){
        return '<span class="badge rounded-0" style="background: #3FB618">Granted</span>';
    } else {
        return '<span class="badge rounded-0" style="background: #FF0039">Not Granted</span>';
    }
}

//created a function to show to details in an offcanvas
const rowView=(ob,rowIndex)=>{

    //hide the update button
    btnPrivilegeSheetUpdate.style.display='none';

    //add the attribute disabled to make inputs block the user input values
    //remove the edited border colors from the inputs
    inputs = document.querySelectorAll('.privilegeSheetInputs');
    inputs.forEach(function (input) {
        input.setAttribute('disabled', 'true');
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //adding disable attribute from all the checkboxes
    privilegeSheetSelect.disabled = true;
    privilegeSheetInsert.disabled = true;
    privilegeSheetUpdate.disabled = true;
    privilegeSheetDelete.disabled = true;
    //setting object values in to the inputs

    //select the appropriate option as selected
    fillSelectOptions(privilegeSheetRole, 'Please Select a Role', roles, 'name',ob.roleID.name);
    fillSelectOptions(privilegeSheetModule, 'Please Select a Module', modules, 'name',ob.moduleID.name);

    //setting the values for checkboxes
    if(ob.selectPrivilege){
        privilegeSheetSelect.checked=true;
        leftSheetSelect.classList.remove('bg-success', 'text-white');
        rightSheetSelect.classList.add('bg-success', 'text-white');
    }
    else{
        privilegeSheetSelect.checked=false;
        leftSheetSelect.classList.add('bg-success', 'text-white');
        rightSheetSelect.classList.remove('bg-success', 'text-white');
    }

    if(ob.insertPrivilege){
        privilegeSheetInsert.checked=true;
        leftSheetInsert.classList.remove('bg-success', 'text-white');
        rightSheetInsert.classList.add('bg-success', 'text-white');
    }
    else{
        privilegeSheetInsert.checked=false;
        leftSheetInsert.classList.add('bg-success', 'text-white');
        rightSheetInsert.classList.remove('bg-success', 'text-white');
    }

    if(ob.updatePrivilege){
        privilegeSheetUpdate.checked=true;
        leftSheetUpdate.classList.remove('bg-success', 'text-white');
        rightSheetUpdate.classList.add('bg-success', 'text-white');
    }
    else{
        privilegeSheetUpdate.checked=false;
        leftSheetUpdate.classList.add('bg-success', 'text-white');
        rightSheetUpdate.classList.remove('bg-success', 'text-white');
    }

    if(ob.deletePrivilege){
        privilegeSheetDelete.checked=true;
        leftSheetDelete.classList.remove('bg-success', 'text-white');
        rightSheetDelete.classList.add('bg-success', 'text-white');
    }
    else{
        privilegeSheetDelete.checked=false;
        leftSheetDelete.classList.add('bg-success', 'text-white');
        rightSheetDelete.classList.remove('bg-success', 'text-white');
    }

    //catch old privilege and new privilege
    oldPrivilege = JSON.parse(JSON.stringify(ob));
    editedPrivilege = JSON.parse(JSON.stringify(ob));

}
//creating a function to reset the privilege form when ever needed
const resetPrivilegeForm = ()=> {

    //reset privilege object
    newPrivilege = {}

    //remove validation from chosen select
    $("#privilegeRole_chosen .chosen-single").removeClass('select-validated');
    $("#privilegeModule_chosen .chosen-single").removeClass('select-validated');
    $("#privilegeRole_chosen .chosen-single").removeClass('select-invalidated');
    $("#privilegeModule_chosen .chosen-single").removeClass('select-invalidated');
    privilegeRole.classList.remove('is-valid');
    privilegeModule.classList.remove('is-valid');
    privilegeRole.classList.remove('is-invalid');
    privilegeModule.classList.remove('is-invalid');

    //set default option chosen
    setTimeout(function () {
        $('#privilegeRole').val('').trigger('chosen:updated');
        $('#privilegeModule').val('').trigger('chosen:updated');
    }, 0);

    //reset form
    frmNewPrivilege.reset();

    //setting default values and selected div
    checkBoxValidator(this, leftSelect, rightSelect, 'newPrivilege', 'selectPrivilege', true, false);
    checkBoxValidator(this, leftInsert, rightInsert, 'newPrivilege', 'insertPrivilege', true, false);
    checkBoxValidator(this, leftUpdate, rightUpdate, 'newPrivilege', 'updatePrivilege', true, false);
    checkBoxValidator(this, leftDelete, rightDelete, 'newPrivilege', 'deletePrivilege', true, false);

    //dynamic select content handling
    roles = ajaxGetRequest("/role/getRolesWithoutAdmin")
    fillSelectOptions(privilegeRole, 'Please Select a Role', roles, 'name');


    //reset privilege Module
    privilegeModule.innerHTML = '';
    //set placeholder for chosen select privilegeModule
    privilegeModule.setAttribute('data-placeholder','Please Select a Role First');

    //initialize the 3rd party libraries (chosen)
    $('#privilegeRole').chosen({width: '100%'});
    $('#privilegeModule').chosen({width: '100%'});


}

const loadModulesBySelectedRole = ()=>{

    const selectedRole = newPrivilege.roleID;
    modules = ajaxGetRequest("/module/listByRole?roleID="+selectedRole.id);
    fillSelectOptions(privilegeModule, ' ', modules, 'name');
    privilegeModule.setAttribute('data-placeholder','Please Select a Module');
    $('#privilegeModule').val('').trigger('chosen:updated');
}

//creating a function to edit the privilege form when ever needed
const privilegeEdit=()=>{
    //display the update button once the edit button is clicked
    btnPrivilegeSheetUpdate.style.display = 'block';

    //remove the attribute readonly to make inputs accept the user input values
    //give a border color to inputs indicate that the input's values are ready to be edited
    inputs = document.querySelectorAll('.privilegeSheetInputs');
    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
        input.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    });

    //removing disable attribute from all the checkboxes
    privilegeSheetSelect.disabled = false;
    privilegeSheetInsert.disabled = false;
    privilegeSheetUpdate.disabled = false;
    privilegeSheetDelete.disabled = false;

}

//creating a function to submit the privilege form when ever needed
const newPrivilegeSubmit = ()=>{
    console.log(newPrivilege);

    //calling the checkPrivilegeFormErrors function and catching the return value to errors variable
    let errors = checkPrivilegeFormErrors(newPrivilege);

    //check the errors variable is null
    //if it's null that means all the required inputs are filled
    if(errors===''){

        //get a user confirmation using external customConfirm js
        showCustomConfirm("You are about to add a New Privilege<br>Are You Sure?", function (result) {

            if(result){
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                let serviceResponse = ajaxHttpRequest("/Privilege",'POST',newPrivilege);

                //check the serviceResponse value is "OK"
                if(serviceResponse==="OK"){
                    //this means data successfully passed to the backend
                    //show an alert to user
                    showCustomModal("Privilege Successfully Added!", "success");
                    //close the offCanvas sheet
                    offCanvasPrivilegeCloseButton.click();
                    //refresh table and reset form
                    refreshPrivilegeTable();
                    resetPrivilegeForm();
                }
                else{

                    //this means there was a problem with the query
                    //shows an error alert to the user
                    showCustomModal("Operation Failed!" + serviceResponse, "error");
                }

            }
                //will execute this block if the user confirmation is "no"
                //show user an alert
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

//creating a reusable function to check all the required inputs are filled by checking bound values
//need to pass the object as a parameter
//this function will return if there are any unfilled inputs
const checkPrivilegeFormErrors = (privilegeObject)=>{
    let errors = '';

    if(privilegeObject.roleID==null){
        errors = errors +'Role is Required<br>';
        $("#privilegeRole_chosen .chosen-single").addClass('select-invalidated');
        privilegeRole.classList.add('is-invalid');
    }
    if(privilegeObject.moduleID==null){
        errors = errors +'Module is Required<br>';
        $("#privilegeModule_chosen .chosen-single").addClass('select-invalidated');
        privilegeModule.classList.add('is-invalid');
    }

    return errors;
}

//creating a function to update the privilege when ever needed
const privilegeUpdate = ()=>{
    console.log(editedPrivilege);

    //calling the checkPrivilegeFormErrors function and catching the return value to errors variable
    let errors = checkPrivilegeFormErrors(editedPrivilege);

    //check the errors variable is null
    //if it's null that means all the required inputs are filled
    if(errors===''){
        //calling the checkForPrivilegeUpdate function and catching the return value to updates variable
        let updates = checkForPrivilegeUpdate();
        //check the updates variable is null
        //if it's null that means there are no any updates
        if (updates === '') {
            showCustomModal("No changes Detected!", "info");
        }
        else{
            //get a user confirmation using external customConfirm js
            showCustomConfirm("You are About to Update this Privilege<br><br>Following Changes Detected!<br/><br/><small>" + updates + "</small><br>Are You Sure?",function (result){
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                if(result){
                    //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                    //catch the return value from the backend and save it in the serviceResponse variable
                    let serverResponse = ajaxHttpRequest("/Privilege","PUT",editedPrivilege);

                    //check the serviceResponse value is "OK"
                    if(serverResponse==="OK"){
                        //this means data successfully passed to the backend
                        //show an alert to user
                        showCustomModal("Privilege Successfully Updated!", "success");
                        //close the offCanvas sheet
                        offCanvasPrivilegeSheetCloseButton.click();
                        //refresh table
                        refreshPrivilegeTable();

                    }
                    else{
                        showCustomModal("Operation Failed!" + serviceResponse, "error")
                    }

                }
                else{
                    showCustomModal("Operation Cancelled!", "info");
                }
            });
        }


    }
    else{
        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');
    }

}

//this function will check for any updates by comparing old and edited privilege object
//this function will return if there are any updates
const checkForPrivilegeUpdate=()=>{

    let updates = '';
    if(editedPrivilege.roleID.name!==oldPrivilege.roleID.name){
        updates = updates + "Role was changed to <span class='text-purple'>" + editedPrivilege.roleID.name + "</span><br>";
    }
    if(editedPrivilege.moduleID.name!==oldPrivilege.moduleID.name){
        updates = updates + "Module was changed to <span class='text-purple'>" + editedPrivilege.moduleID.name + "</span><br>";

    }
    if(editedPrivilege.selectPrivilege!==oldPrivilege.selectPrivilege){
        if(editedPrivilege.selectPrivilege){
            updates = updates + "Select Privilege was changed to <span class='text-purple'>Granted</span><br>";
        }
        else{
            updates = updates + "Select Privilege was changed to <span class='text-purple'>Not Granted</span><br>";
        }
    }
    if(editedPrivilege.insertPrivilege!==oldPrivilege.insertPrivilege){
        if(editedPrivilege.insertPrivilege){
            updates = updates + "Insert Privilege was changed to <span class='text-purple'>Granted</span><br>";
        }
        else{
            updates = updates + "Insert Privilege was changed to <span class='text-purple'>Not Granted</span><br>";
        }
    }
    if(editedPrivilege.updatePrivilege!==oldPrivilege.updatePrivilege){
        if(editedPrivilege.updatePrivilege){
            updates = updates + "Update Privilege was changed to <span class='text-purple'>Granted</span><br>";
        }
        else{
            updates = updates + "Update Privilege was changed to <span class='text-purple'>Not Granted</span><br>";
        }
    }
    if(editedPrivilege.deletePrivilege!==oldPrivilege.deletePrivilege){
        if(editedPrivilege.deletePrivilege){
            updates = updates + "Delete Privilege was changed to <span class='text-purple'>Granted</span><br>";
        }
        else{
            updates = updates + "Delete Privilege was changed to <span class='text-purple'>Not Granted</span><br>";
        }
    }


    return updates;

}

//creating a function to delete a privilege when ever needed
const privilegeDelete = ()=>{
    //get user confirmation
    showCustomConfirm("You are About to Delete this Privilege<br><br>Role Name: <span class='text-purple'>"+oldPrivilege.roleID.name+"</span><br>Module Name: <span class='text-purple'>"+oldPrivilege.moduleID.name+"</span><br><br>Are You Sure?",function (result) {
        if(result){
            //pass the record to backend
            //receive the server response
            let serviceResponse = ajaxHttpRequest("/Privilege","DELETE",oldPrivilege);
            if(serviceResponse==="OK"){
                //show user the response
                showCustomModal("Privilege Successfully Deleted!", "success");
                //close the offCanvas sheet
                offCanvasPrivilegeSheetCloseButton.click();
                //refresh table
                refreshPrivilegeTable();
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