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
    let batchSelected = false;
    let registrationSelected = false;

    if(markSearchBatch.value !== ''){
        batchSelected = true;
    }
    if(markSearchRegistration.value !== ''){
        registrationSelected = true;
    }

    // Condition 1: Neither batch nor registration is selected
    if (!batchSelected && !registrationSelected) {
        showCustomModal('Please select a batch or a registration to generate the report','warning');
    }
    // Condition 2: Only batch is selected
    else if (batchSelected && !registrationSelected) {
        marks = ajaxGetRequest('/Mark/getByBatchID/')
    }
    // Condition 3: Only registration is selected
    else if (!batchSelected && registrationSelected) {
       //this cant happen because registration is dependent on batch
    }
    // Condition 4: Both batch and registration are selected
    else if (batchSelected && registrationSelected) {
        console.log("Both batch and registration are selected");
    }

}