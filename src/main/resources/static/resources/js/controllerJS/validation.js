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
    //sorting
    lessons.sort((a, b) => a.id - b.id);

    const students =  ajaxGetRequest("/Registration/getRegistrations/"+JSON.parse(marksSearchBatch.value).id);

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
        th.innerText = lesson.code;
        trThead.appendChild(th);
    })

    const thAction = document.createElement('th');
    thAction.innerText = 'Action';
    trThead.appendChild(thAction);

    tableHead.appendChild(trThead);

    // Append the table head to the table
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    students.forEach((student, index) => {
        const tr = document.createElement('tr');
        const tdIndex = document.createElement('td');
        //use foreach loop to add text to the created tds
        tdIndex.innerText = index + 1;
        //append the remaining tds to the tr
        tr.appendChild(tdIndex);

        const tdRegistration = document.createElement('td');
        tdRegistration.innerText = student.registrationNumber;
        tr.appendChild(tdRegistration);

        const tdStudent = document.createElement('td');
        tdStudent.innerText = student.studentID.nameWithInitials;
        tr.appendChild(tdStudent);

        //creating td for lessons
        for (i=1;i<=lessons.length;i++){
            const tdInput = document.createElement('td');
            tdInput.innerHTML = '<input type="text" class="form-control rounded-0 mx-auto" style="width: 50px;">';
            tr.appendChild(tdInput)
        }

        const tdButton = document.createElement('td');
        tdButton.innerHTML='<button class="btn btn-success btn-sm text-white rounded-0">Save</button>'
        tr.appendChild(tdButton);

        tableBody.appendChild(tr);
    })



    // Append the table to the div with id 'tblContainer'
    tblContainer.appendChild(table);

    $('table').dataTable();
}