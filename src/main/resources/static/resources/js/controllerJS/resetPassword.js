window.addEventListener("load", () => {
    password.disabled = true;
    btnSendOtp.disabled = true;
    btnUpdate.disabled = true;

    username.addEventListener('keyup', () => {
        if (username.value !== '') {
            if (/^[a-zA-Z]{2,19}@[a-zA-Z]{2,8}\.[a-zA-Z]{2,3}$/.test(username.value)) {
                btnSendOtp.disabled = false;
            } else {
                btnSendOtp.disabled = true;
            }

        } else {
            btnSendOtp.disabled = true;
        }

    })

})


const sendOTP = () => {
    const serverResponse = ajaxHttpRequest("/Reset-Password/" + username.value, "POST");
    window.currentEmail = username.value;
    if (serverResponse === "OK") {
        lblPassword.classList.remove('d-none');
        countdown(2, countdownText, 'You can request another OTP after');

        btnSendOtp.disabled = true;
        username.disabled = true;
        btnLogin.disabled = false;

        otpContainer.classList.remove('d-none');
        //check an account is present
        //send a email
        //display a user msg
        password.disabled = false;
        password.focus();
        setTimeout(function () {
            btnSendOtp.disabled = false;
            username.disabled = false;
            countdownText.innerHTML = '<small>You Can Request a New OTP Now</small>'
        }, 120000);

        showCustomModal("Email Contain OTP sent successfully", "success")
    } else {
        showCustomModal(serverResponse, "error");
    }


}

const checkOTP = () => {
    const serverResponse = ajaxHttpRequest("/Reset-Password/OTP/" + window.currentEmail + "/" + password.value, "POST")
    if (serverResponse === "OK") {
        //show modal for password reset
        $('#modalChangePassword').modal('show');
    } else {
        showCustomModal(serverResponse, "error")
    }
}

var countdownInterval;

function countdown(minutes) {
    var seconds = 60;
    var mins = minutes;

    function tick() {
        var counter = document.getElementById("countdownText");
        var current_minutes = mins - 1;
        seconds--;

        counter.innerHTML = "<small>You can request another OTP after 0" + current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds) + " minutes</small>";

        if (seconds > 0) {
            countdownInterval = setTimeout(tick, 1000);
        } else {
            if (mins > 1) {
                seconds = 60;
                countdownInterval = setTimeout(tick, 1000);
                mins--;
            }
        }
    }

    tick();
}

function stopCountdown() {
    clearTimeout(countdownInterval);
}

const passwordValidator = () => {
    const regexPattern = new RegExp('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
    //checking for element value (value cant be null)
    if (newPassword.value !== '') {

        if (regexPattern.test(newPassword.value)) {
            newPassword.style.border = '1px solid green';
            newPassword.style.background = 'white';
            newPassword.style.color = 'green';
            newPassword.classList.add('is-valid');
            newPassword.classList.remove('is-invalid');

            window.newRawPassword = newPassword.value;
        } else {

            window.newRawPassword = null;
            newPassword.style.border = '1px solid red';
            newPassword.style.background = 'white';
            newPassword.style.color = 'red';

            newPassword.classList.remove('is-valid');
            newPassword.classList.add('is-invalid');
        }

    } else {
        //if element is required, display error / warning (use border color or boostrap validation)
        if (newPassword.required) {
            newPassword.style.border = '1px solid red';
            newPassword.style.background = 'white';
            newPassword.style.color = 'red';

            newPassword.classList.remove('is-valid');
            newPassword.classList.add('is-invalid');
        }
        //if the element is not required, display the default colors (remove boostrap validation)
        else {
            newPassword.style.border = '1px solid #ced4da';
            newPassword.style.background = 'white';
            newPassword.style.color = 'black';
            newPassword.classList.remove('is-valid');
            newPassword.classList.remove('is-invalid');


        }
    }

}

const matchPassword = () => {
    if (confirmPassword.value !== '') {
        if (window.newRawPassword === confirmPassword.value) {
            confirmPassword.style.border = '1px solid green';
            confirmPassword.style.background = 'white';
            confirmPassword.style.color = 'green';
            confirmPassword.classList.add('is-valid');
            confirmPassword.classList.remove('is-invalid');
            btnUpdate.disabled = false;


        } else {
            confirmPassword.style.border = '1px solid red';
            confirmPassword.style.background = 'white';
            confirmPassword.style.color = 'red';

            confirmPassword.classList.remove('is-valid');
            confirmPassword.classList.add('is-invalid');
            btnUpdate.disabled = true;
        }
    }
}

const updatePassword = () => {
    const severResponse = ajaxHttpRequest("/Reset-Password/Update/" + window.currentEmail + "/" + window.newRawPassword, "POST");
    if (severResponse === "OK") {
        showCustomModal("Password Updated Successfully", "success");
        modalChangePasswordCloseButton.click();
        frmUpdate.reset();
        frmOTP.reset();
        confirmPassword.classList.remove('is-valid');
        confirmPassword.classList.remove('is-invalid');
        newPassword.classList.remove('is-valid');
        newPassword.classList.remove('is-invalid');

        //stop timer
        stopCountdown()
        //show default msg
        btnSendOtp.disabled = true;
        username.disabled = false;
        countdownText.innerHTML = '<small>You Can Request a New OTP Now</small>'
        otpContainer.classList.add('d-none');
        lblPassword.classList.add('d-none');


    } else {
        showCustomModal(severResponse, "error")
    }

}