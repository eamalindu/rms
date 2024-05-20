window.addEventListener("load", function () {

    const batchesConductingToday = ajaxGetRequest("Batch/getBatchesConductToday")
    createBatchesConductingToday(batchesConductingToday, batchesTodayContainer)

});

//This function will generate batch information that will conduct today
//This function has two arguments
//1) dataList -> data Array which contain actual data from the database
//2) containerID -> element id of where the divs should display
//This function is called using window.load event handler
const createBatchesConductingToday = (dataList, containerID) => {

    //clear the content in containerID
    containerID.innerHTML = '';
    //check the dataList is empty or not
    if (dataList.length > 0) {
        //remove the placeholder because the dataList is not empty
        placeholderBatches.classList.add('d-none');
        //This means dataList is not empty
        //using forEach function to loop over the contents of the dataList array
        dataList.forEach((element, index) => {
            //create a div and save it in the div variable
            var div = document.createElement('div');
            //add relevant class names to div
            div.className = 'container border d-flex p-3 mb-2';
            //get the current day and save it
            //adding 1 because sunday is 0, monday is 1, ...
            var currentDay = new Date().getDay() + 1;
            //loop over batchHasDayList because it can contain one or more timetable
            for (const day of element.batchHasDayList) {
                //if the current day is equal to a one in the batchHasDayList save it
                if (day.dayID.id === currentDay) {
                    correctSchedule = day;
                    //break the loop
                    break;
                }
            }

            //set innerHTML accordingly
            div.innerHTML = `<div class="w-75 ">
                                    <span class="text-muted small ">Course | Batch | Location | Schdule</span>
                                    <p class="mb-0">${element.courseID.code} / <span>${element.batchCode}</span> / <span>${correctSchedule.lectureRoomID.code}  - ${correctSchedule.lectureRoomID.floor}</span> / ${correctSchedule.startTime.slice(0, -3)} - ${correctSchedule.endTime.slice(0, -3)}</p>
                                </div>
                                <div class="w-25 text-end">
                                    <span class="text-muted small">Attendance</span>
                                    <h5 class="mb-0">10</h5>
                                </div>`;

            //attach the div for the parent container
            containerID.appendChild(div);

        })
    } else {
        //This means dataList is empty
        //display the placeholder
        placeholderBatches.classList.remove('d-none');
    }


}

//creating function to search registration when a registration number is typed in to the text field
const searchRegistration = () => {
    //save the text field current value to searchText variable
    const searchText = registrationSearchID.value;
    //check the searchText is empty or not
    if (searchText !== '') {
        //this means searchText is not empty
        //using ajaxGetRequest to send a GET request and get the particluar registration and save it to the searchResult variable
        let searchResult = ajaxGetRequest("Registration/getRegistrationHaveClassToday/" + searchText)

        //check searchResult is empty or not
        if (searchResult !== '') {
            //this means searchResult is not empty
            //show to the searchResultRegistration div
            searchResultRegistration.classList.remove('d-none');
            //remove the placeholder div
            placeholderRegistration.classList.add('d-none')

            //set the details for the searchResultRegistration div
            searchResultStudentName.innerText = searchResult.studentID.title + " " + searchResult.studentID.nameWithInitials;
            searchResultRegistrationNumber.innerText = searchResult.registrationNumber;

            searchResultCourse.innerText = searchResult.courseID.name;
            searchResultBatch.innerText = searchResult.batchID.batchCode;

            var currentDay = new Date().getDay() + 1;
            //loop over batchHasDayList because it can contain one or more timetable
            for (const day of searchResult.batchID.batchHasDayList) {
                //if the current day is equal to a one in the batchHasDayList save it
                if (day.dayID.id === currentDay) {
                    correctSchedule = day;
                    //break the loop
                    break;
                }
            }

            if (searchResult.registrationStatusID.name === "Active") {
                searchResultStatus.innerHTML = '<span class="badge rounded-0 w-25" style="background: #3FB618">Active</span>';
            } else if (searchResult.registrationStatusID.name === "Suspended") {
                searchResultStatus.innerHTML = '<span class="badge rounded-0 w-25" style="background: #ea8a1e">Suspended</span>';
            } else if (searchResult.registrationStatusID.name === "Cancelled") {
                searchResultStatus.innerHTML = '<span class="badge rounded-0 w-25" style="background: #ea2f1e">Cancelled</span>';
            } else if (searchResult.registrationStatusID.name === "Pending") {
                searchResultStatus.innerHTML = '<span class="badge rounded-0 w-25" style="background: #616161">Pending</span>';
            } else if (searchResult.registrationStatusID.name === "In Review") {
                searchResultStatus.innerHTML = '<span class="badge rounded-0 w-25" style="background: #d8b73a">In Review</span>';
            } else {
                searchResultStatus.innerHTML = '<span class="badge rounded-0 w-25" style="background: #000">Deleted</span>';
            }

            searchResultLocation.innerText = correctSchedule.lectureRoomID.name + ", " + correctSchedule.lectureRoomID.floor;
            searchResultSchedule.innerText = correctSchedule.startTime.slice(0, -3) + " to " + correctSchedule.endTime.slice(0, -3);

            searchResultOutstanding.innerText = "Rs. " + searchResult.balanceAmount.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
            searchResultDue.innerText = "Rs. " + searchResult.balanceAmount.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });

            if (searchResult.isFullPayment) {
                searchResultPaymentType.innerText = "One Time Payment";
            } else {
                searchResultPaymentType.innerText = "Installments";
            }


        } else {
            searchResultRegistration.classList.add('d-none');
            placeholderRegistration.classList.remove('d-none')
            showCustomModal("No classes available today <br> for the registration : <span class='text-lowercase text-steam-green'>" + searchText + "</span>", "error");

        }
    } else {
        showCustomModal("Registration Number is required for a search", "warning");
    }


}

const registrationSearchReset = () => {
    registrationSearchID.value = '';
    searchResultRegistration.classList.add('d-none');
    placeholderRegistration.classList.remove('d-none')
}