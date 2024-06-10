window.addEventListener('load',()=>{
    $('#examSearchCourse').chosen({width: '200px'});
    $('#examSearchBatch').chosen({width: '200px'});
    $('#examSearchLesson').chosen({width: '200px'});
    $('#examSearchRegistration').chosen({width: '200px'});

    //initialize 3rd party daterangepicker library
    //Set the minDate for the batchSheetCommenceDate as the current object's commenceDate value
    $('#examSearchDateRange').daterangepicker({
        "minDate": new Date(),
        "singleDatePicker": true,
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": true,
        "drops": "down",
        "locale": {
            "format": "YYYY-MM-DD"
        }
    });
})

const resetSearchBar=()=>{

}