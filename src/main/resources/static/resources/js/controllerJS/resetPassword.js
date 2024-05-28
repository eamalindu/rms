const sendOTP = ()=>{
    showCustomModal("Email Contain OTP sent successfully","success")
}

const countdown=(minutes,elementID,msg)=> {
    var seconds = 60;
    var mins = minutes
    function tick() {
        var counter = elementID;
        var current_minutes = mins-1
        seconds--;
        counter.innerHTML ="<small>"+msg+" 0"+ current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds)+" mintues</small>";
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
