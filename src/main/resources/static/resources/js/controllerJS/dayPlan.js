window.addEventListener("load", () => {

    resetDayPlanForm();
});

const resetDayPlanForm = () => {
    const batches = ajaxGetRequest("/Batch/getBatchesConductTodayByLecturer/" + btnProfileName.innerText);
    fillSelectOptions(dayPlanBatch, ' ', batches, "batchCode");
    $('#dayPlanBatch').chosen({width: '100%'});

    resetInnerForm();
}


const resetInnerForm = ()=>{

}