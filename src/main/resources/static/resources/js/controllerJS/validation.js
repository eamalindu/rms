window.addEventListener('load', () => {
    resetSearchBar();
    createScrollingTitle(350);
});


const getBatches = () => {
    const batches = ajaxGetRequest("/Batch/getBatchesByCourseID/" + JSON.parse(marksSearchCourse.value).id)
    fillSelectOptions(marksSearchBatch, ' ', batches, 'batchCode');
    marksSearchBatch.setAttribute('data-placeholder', 'Select A Batch Now');
    $('#marksSearchBatch').val('').trigger('chosen:updated');
}

const resetSearchBar = () => {
    courses = ajaxGetRequest("/Course/findall");
    fillSelectOptions(marksSearchCourse, ' ', courses, 'name');


    $('#marksSearchCourse').chosen({width: '200px'});
    $('#marksSearchBatch').chosen({width: '200px'});
}

const generateMarksTable = () => {

    //reset table container inside
    tblContainer.innerHTML = '';

    //get lessons from the course
    const lessons = JSON.parse(marksSearchCourse.value).lessonList;

    //create a table
    const table = document.createElement('table');
    table.classList.add('custom-table')
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    const trThead = document.createElement('tr');
    const thHash = document.createElement('th');
    thHash.innerText = '#';
    trThead.appendChild(thHash);

    const thReg = document.createElement('th');
    thReg.innerText = 'Registration';
    trThead.appendChild(thReg);
    const thStudent = document.createElement('th');
    thStudent.innerText = 'Student';
    trThead.appendChild(thStudent);

    lessons.forEach((lesson) => {
        const th = document.createElement('th');
        th.innerText = lesson.name;
        trThead.appendChild(th);
    })

    const thAction = document.createElement('th');
    thAction.innerText = 'Action';
    trThead.appendChild(thAction);

    tableHead.appendChild(trThead);

    // Append the table head to the table
    table.appendChild(tableHead);
    table.appendChild(tableBody);





    // Append the table to the div with id 'tblContainer'
    tblContainer.appendChild(table);
}