window.addEventListener("load", () => {
    password.disabled = true;
    btnSendOtp.disabled = true;

    username.addEventListener('keyup', () => {
        if(username.value!==''){
            if (/^[a-zA-Z]{2,19}@[a-zA-Z]{2,8}\.[a-zA-Z]{2,3}$/.test(username.value)) {
                btnSendOtp.disabled = false;
            }

            else{
                btnSendOtp.disabled = true;
            }

        }
        else{
            btnSendOtp.disabled = true;
        }

    })

})


const sendOTP = () => {

    const User = ajaxGetRequest("Reset-Password/getUserByEmail/"+username.value)
    if(User!==''){
        if(User.status) {
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
            showCustomModal("Email Contain OTP sent successfully", "success");
        }
        else{
            showCustomModal("This User Account is Disabled<br>Please Contact System Administrator", "error");
        }
    }
    else{
        showCustomModal("No User Account Found For Provided Email", "error");
    }


}

function countdown(minutes) {
    var seconds = 60;
    var mins = minutes
    function tick() {
        //This script expects an element with an ID = "counter". You can change that to what ever you want.
        var counter = document.getElementById("countdownText");
        var current_minutes = mins-1
        seconds--;
        counter.innerHTML ="<small>You can request another OTP after 0"+ current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds)+" mintues</small>";
        if( seconds > 0 ) {
            setTimeout(tick, 1000);
        } else {
            if(mins > 1){
                countdown(mins-1);
            }
        }
    }
    tick();
}
