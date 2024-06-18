window.addEventListener("load", () => {
    const batches = ajaxGetRequest("/Batch/getBatchesConductTodayByLecturer/" + btnProfileName.innerText);
    fillSelectOptions(dayPlanBatch, ' ', batches, "batchCode");
    $('#dayPlanBatch').chosen({width: '100%'});
});
