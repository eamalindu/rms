window.addEventListener('load',()=>{
    resetSearchBar();

    //validation chosen select (for new User)
    $("#markSearchBatch").chosen().change(function () {
        $("#markSearchBatch_chosen .chosen-single").addClass('bg-light');
    });
    $("#markSearchRegistration").chosen().change(function () {
        $("#markSearchRegistration_chosen .chosen-single").addClass('bg-light');
    });
})

const resetSearchBar = () => {
    const batches = ajaxGetRequest("/Batch/findall");
    fillSelectOptions(markSearchBatch,' ',batches,'batchCode');
    $('#markSearchBatch').chosen({width:'40%'})
    $('#markSearchRegistration').chosen({width:'40%'})

}

const getRegistrations = ()=>{
    const selectedBatch = JSON.parse(markSearchBatch.value);
    const registrations = ajaxGetRequest('/Registration/getRegistrations/'+selectedBatch.id);
    fillSelectOptions(markSearchRegistration,' ',registrations,'registrationNumber');
    markSearchRegistration.setAttribute('data-placeholder','Select a Registration');
    $('#markSearchRegistration').trigger('chosen:updated');
}

const getMarkReport = () => {

}