window.addEventListener('load', () => {
    resetSearchBar();
});


const getBatches = () => {
    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/" + JSON.parse(marksSearchCourse.value).id)
    fillSelectOptions(marksSearchBatch, ' ', batches, 'batchCode');
    marksSearchBatch.setAttribute('data-placeholder','Select A Batch Now');
    $('#marksSearchBatch').val('').trigger('chosen:updated');
}

const resetSearchBar = ()=>{
    courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(marksSearchCourse, ' ', courses, 'name');


    $('#marksSearchCourse').chosen({width: '200px'});
    $('#marksSearchBatch').chosen({width: '200px'});
}

    const generateMarksTable = ()=>{

    //reset table container inside
    tblContainer.innerHTML = '';

    //get lessons from the course
    const lessons = JSON.parse(marksSearchCourse.value).lessonList;

    //create a table
    const table = document.createElement('table');
    table.classList.add('custom-table')
    const tableHead = document.createElement('thead');
    const trThead = document.createElement('tr');

    lessons.forEach((lesson)=>{
        const th = document.createElement('th');
        th.innerText = lesson.name;
        trThead.appendChild(th);
    })


    tableHead.appendChild(trThead);

    // Append the table head to the table
    table.appendChild(tableHead);

    // Append the table to the div with id 'tblContainer'
    tblContainer.appendChild(table);
}