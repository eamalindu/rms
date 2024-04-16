window.addEventListener("load", () => {

    //reset the registration form
    resetRegistrationForm();
    //refresh the registration table
    refreshRegistrationTable();

    //refresh/refill search filters
    courses =  ajaxGetRequest("/Course/findall");
    fillSelectOptions(registrationSearchCourse, ' ', courses, 'name');

    registrationStatus = ajaxGetRequest("/RegistrationStatus/findall");
    fillSelectOptions(registrationSearchStatus,' ',registrationStatus,'name');

    //initialize the 3rd party libraries (chosen)
    $('.chosen-registration-search').chosen({width: '190px'});
    $('#registrationSearchDateRange').daterangepicker({
        "locale": {
            "format": "YYYY-MM-DD",
            //"separator": " to "
        }
    });

});

//creating a function to refresh the registrations table when ever needed
const refreshRegistrationTable = ()=>{

    const registrations = ajaxGetRequest("/Registration/findall");
    //creating a display property list for the batches
    displayPropertyListForBatches = [
        {property: 'registrationNumber', dataType: 'text'},
        {property: getStudentName, dataType: 'function'},
    ];

    fillDataIntoTable(tblInquiry, registrations, displayPropertyListForBatches, rowView, 'offcanvasBatchSheet');

    $('#tblInquiry').DataTable();

}

const getStudentName =(ob)=>{

    return ob.studentID.title+' '+ob.studentID.nameWithInitials+' <br/><span class="badge w-50 rounded-0" style="background: darkgrey">'+ob.studentID.studentNumber+'</span>';
}

//creating a function to reset the registrations form when ever needed
const resetRegistrationForm=()=>{



}

const rowView=()=>{

}

//reset chosen select using jquery
$('#btn-reset').on('click', function () {
    setTimeout(function () {
        $('.chosen-registration-search').trigger('chosen:updated');
    }, 0);
});
