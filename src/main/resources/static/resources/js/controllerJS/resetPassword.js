window.addEventListener("load", () => {
    password.disabled = true;
    btnSendOtp.disabled = true;

    username.addEventListener('keyup', () => {
        btnSendOtp.disabled = false;
        if (username.value == '') {
            btnSendOtp.disabled = true;
        }

    })

})


const sendOTP = () => {
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
    setTimeout(function() {
        btnSendOtp.disabled = false;
        username.disabled = false;}, 120000);
    showCustomModal("Email Contain OTP sent successfully", "success");
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
