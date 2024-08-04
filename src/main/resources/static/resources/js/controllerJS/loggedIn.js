window.addEventListener('load', () => {
    loggedInUser = ajaxGetRequest("/loggedInUser");
    loggedInImageIcon.src = atob(loggedInUser.photoPath);
})

const getLoggedInUser=()=>{
    //hide the update button
    loggedInUserUpdateBtn.classList.add('d-none');



    //setting data
    loggedInUsername.value = loggedInUser.username;
    loggedInImage.src = atob(loggedInUser.photoPath);
    loggedInEmail.value = loggedInUser.email;
    loggedInUserTimestamp.innerText = loggedInUser.addedTime.replace("T"," ");
    loggedInRoles.value = loggedinDesg.innerText;

    //remove editable attributes set
    loggedInUsername.setAttribute('disabled', 'true');
    loggedInUsername.style = '';
    loggedInUsername.classList.remove('is-valid');
    loggedInUsername.classList.remove('is-invalid');
    loggedInPassword.setAttribute('disabled', 'true');
    loggedInPassword.style = '';
    loggedInPassword.classList.remove('is-valid');
    loggedInPassword.classList.remove('is-invalid');
    loggedInPassword.value = '*******';
    passwordHint.classList.add('d-none');

    //catch old inquiry and new inquiry
    oldLoggedInUser = JSON.parse(JSON.stringify(loggedInUser));
    editedLoggedInUser = JSON.parse(JSON.stringify(loggedInUser));
}


const editLoggedInUser=()=>{
    //show the update button
    loggedInUserUpdateBtn.classList.remove('d-none');

    //getting the toast from its ID
    var myToastEl = document.getElementById('myToast');
    var myToast = new bootstrap.Toast(myToastEl);
    //Displaying toast
    myToast.show();
    //hide the toast after 5s
    setTimeout(function () {
        myToast.hide();
    }, 5000);

    //enable editing
    loggedInUsername.removeAttribute('disabled');
    loggedInUsername.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    loggedInPassword.removeAttribute('disabled');
    loggedInPassword.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    loggedInPassword.value = '';
    passwordHint.classList.remove('d-none');
}

const updateLoggedInUser=()=>{
    let errors = checkLoggedInUserErrors();
    if(errors ==='') {
        let updates = checkLoggedInUserUpdate();
        if (updates === '') {
            showCustomModal('No Changes Detected', 'info');
        } else {
            showCustomConfirm("You are About to Update Your Account<br><br>Following Changes Detected!<br/><br/><small>" + updates + "</small><br>Are You Sure?", function (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                if (result) {
                    //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                    //catch the return value from the backend and save it in the serviceResponse variable
                    let serverResponse = ajaxHttpRequest("/loggedInUser", "PUT", editedLoggedInUser);
                    //check the serviceResponse value is "OK"
                    if (serverResponse === "OK") {
                        //this means data successfully passed to the backend
                        //show an alert to user
                        showCustomModal("Your Account Successfully Updated!<br> Please Log Back in!", "success");
                        //close the modal
                        userModalCloseBtn.click();
                        getLoggedInUser();
                        //logout
                        setTimeout(function () {
                            window.location.assign("/logout");
                        }, 1000);


                    } else {
                        showCustomModal("Operation Failed!" + serverResponse, "error")
                    }


                } else {
                    showCustomModal("Operation Cancelled!", "info");
                }
            });
        }
    }
    else{
        showCustomModal(errors,'warning');
    }
}

const checkLoggedInUserUpdate=()=>{
    let updates = '';
    if(oldLoggedInUser.username !== editedLoggedInUser.username){
        updates = updates + "Username was changed to <span class='text-steam-green'>" + editedLoggedInUser.username + "</span><br>";
    }
    if(oldLoggedInUser.newPassword !== editedLoggedInUser.newPassword){
        updates = updates + "Password was changed<br>";
    }
    return updates;
}

const checkLoggedInUserErrors=()=>{
    let errors = ''
    if(editedLoggedInUser.username==null){
        errors += 'Username is Required<br>';
    }
    // if(editedLoggedInUser.newPassword == null){
    //     errors += 'Password is Required<br>';
    // }
    return errors;
}