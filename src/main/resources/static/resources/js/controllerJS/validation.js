window.addEventListener('load', () => {
    resetSearchBar();
});


const getBatches = () => {
    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/" + JSON.parse(marksSearchCourse.value).id)
    fillSelectOptions(marksSearchBatch, ' ', batches, 'batchCode')
    $('#marksSearchBatch').val('').trigger('chosen:updated');
}

const resetSearchBar = ()=>{
    courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(marksSearchCourse, ' ', courses, 'name');


    $('#marksSearchCourse').chosen({width: '200px'});
    $('#marksSearchBatch').chosen({width: '200px'});
}