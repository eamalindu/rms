window.addEventListener("load", () => {

    //reset the registration form
    resetRegistrationForm();
    //refresh the registration table
    refreshRegistrationTable();
});

//creating a function to refresh the registrations table when ever needed
const refreshRegistrationTable = ()=>{

}

//creating a function to reset the registrations form when ever needed
const resetRegistrationForm=()=>{

    //initialize the 3rd party libraries (chosen)
    $('.chosen-registration-search').chosen({width: '190px'});
    $('#registrationSearchDateRange').daterangepicker({
        "locale": {
            "format": "YYYY-MM-DD",
            //"separator": " to "
        }
    });

}