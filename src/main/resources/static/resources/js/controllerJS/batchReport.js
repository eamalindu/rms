window.addEventListener('load',()=>{

    resetSearchBar();
});

const resetSearchBar = ()=>{
    const courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(SearchCourse,' ',courses,'name');

    $('#SearchCourse').chosen();
    $('#SearchBatch').chosen();
}

const getBatches = ()=>{
    selectedCourse  = JSON.parse(SearchCourse.value);
    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/"+selectedCourse.id);
    fillSelectOptions(SearchBatch,' ',batches,'batchCode');

}