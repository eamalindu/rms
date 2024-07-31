window.addEventListener('load', () => {

})

const getLoggedInUser=()=>{
    //hide the update button
    loggedInUserUpdateBtn.classList.add('d-none');

    loggedInUser = ajaxGetRequest("/User/loggedInUser");

    //setting data
    loggedInUsername.value = loggedInUser.username;
    loggedInEmail.value = loggedInUser.email;
    loggedInUserTimestamp.innerText = loggedInUser.addedTime.replace("T"," ");
    loggedInUser.roles.forEach((role)=>{
        loggedInRoles.value += role.name+" ";
    })

    //remove editable attributes set
    loggedInUsername.setAttribute('disabled', 'true');
    loggedInUsername.style = '';
    loggedInUsername.classList.remove('is-valid');
    loggedInPassword.setAttribute('disabled', 'true');
    loggedInPassword.style = '';
    loggedInPassword.classList.remove('is-valid');
    loggedInPassword.value = '*******';

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
}