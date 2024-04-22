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
        {property: getCourseName, dataType: 'function'},
        {property: getContactNumber, dataType: 'function'},
        {property: getDate, dataType: 'function'},
        {property: 'addedBy', dataType: 'text'},
        {property: getStatus, dataType: 'function'},
    ];

    fillDataIntoTable(tblInquiry, registrations, displayPropertyListForBatches, rowView, 'offcanvasRegistrationSheet');

    $('#tblInquiry').DataTable();

}

const getStudentName =(ob)=>{

    return ob.studentID.title+' '+ob.studentID.nameWithInitials+' <br/><span class="badge w-50 rounded-0" style="background: darkgrey">'+ob.studentID.studentNumber+'</span>';
}

const getCourseName =(ob)=>{

    return ob.courseID.name+' ('+ob.courseID.code+')<br/><small class="text-muted">'+ob.batchID.batchCode+'</small>';
}

const getContactNumber = (ob)=>{

    return ob.studentID.mobileNumber;
}


const getDate = (ob)=>{
    const [addedDate, addedTime] = ob.timestamp.split("T");
    return addedDate+'<br/><small class="text-muted">'+addedTime+'</small>';
}

const getStatus = (ob) => {
    if (ob.registrationStatusID.name === "Active") {
        return '<span class="badge rounded-0" style="background: #3FB618">Active</span>';
    } else if (ob.registrationStatusID.name === "Suspended") {
        return '<span class="badge rounded-0" style="background: #ea8a1e">Suspended</span>';
    } else if (ob.registrationStatusID.name === "Cancelled") {
        return '<span class="badge rounded-0" style="background: #ea2f1e">Cancelled</span>';
    }
    else{
        return '<span class="badge rounded-0" style="background: #000">Deleted</span>';
    }


}
//creating a function to reset the registrations form when ever needed
const resetRegistrationForm=()=>{



}

const rowView=(ob,index)=>{
    //hide the update btn
    btnRegistrationSheetUpdate.style.display = 'none';
    //show the deleted btn
    btnRegistrationSheetDelete.style.display = 'block';

    //refill data
    registrationSheetCode.innerText = ob.registrationNumber;
    const [addedDate, addedTime] = ob.timestamp.split("T");
    registrationSheetJoinedDateText.innerHTML = addedDate+" at "+addedTime;

}

//reset chosen select using jquery
$('#btn-reset').on('click', function () {
    setTimeout(function () {
        $('.chosen-registration-search').trigger('chosen:updated');
    }, 0);
});
