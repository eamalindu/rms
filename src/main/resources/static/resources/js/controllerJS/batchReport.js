window.addEventListener('load',()=>{

    resetSearchBar();

    //validation chosen select (for new quick payment)
    $("#SearchCourse").chosen().change(function () {
        $("#SearchCourse_chosen .chosen-single").addClass('bg-light');
    });
    $("#SearchBatch").chosen().change(function () {
        $("#SearchBatch_chosen .chosen-single").addClass('bg-light');
    });
});

const resetSearchBar = ()=>{
    const courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(SearchCourse,' ',courses,'name');

    $('#SearchCourse').chosen({width: '225px'});
    $('#SearchBatch').chosen({width: '225px'});
}

const getBatches = ()=>{
    selectedCourse  = JSON.parse(SearchCourse.value);
    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/"+selectedCourse.id);
    fillSelectOptions(SearchBatch,' ',batches,'batchCode');
    SearchBatch.setAttribute('data-placeholder', 'Please Select a Batch');
    $('#SearchBatch').val('').trigger('chosen:updated');
}

const getBatchReport = ()=>{
    selectedBatch  = JSON.parse(SearchBatch.value);
   batchReport = ajaxGetRequest("/Batch/getBatchInfo/"+selectedBatch.batchCode);
   registrationsForBatch = ajaxGetRequest("/Registration/getRegistrations/"+selectedBatch.id);
}