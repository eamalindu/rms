window.addEventListener("load", function () {
    //using refreshBatchSchedulesForToday function
    refreshBatchSchedulesForToday();
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

            //get attendance from the batch today
            const attendanceNow = ajaxGetRequest("Attendance/getAttendanceByBatchIDForToday/" + element.id);

            //set innerHTML accordingly
            div.innerHTML = `<div class="w-75 ">
                                    <span class="text-muted small ">Course | Batch | Location | Schdule</span>
                                    <p class="mb-0">${element.courseID.code} / <span>${element.batchCode}</span> / <span>${correctSchedule.lectureRoomID.code}  - ${correctSchedule.lectureRoomID.floor}</span> / ${correctSchedule.startTime.slice(0, -3)} - ${correctSchedule.endTime.slice(0, -3)}</p>
                                </div>
                                <div class="w-25 text-end">
                                    <span class="text-muted small">Attendance</span>
                                    <h5 class="mb-0">${attendanceNow.length}</h5>
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

//creating function to generate batches that will conduct today
const refreshBatchSchedulesForToday = () => {
    //get the batches that conducted today using ajaxGetRequest Function and save it to batchesConductingToday variable
    const batchesConductingToday = ajaxGetRequest("Batch/getBatchesConductToday")
    //use createBatchesConductingToday to generate batch information
    createBatchesConductingToday(batchesConductingToday, batchesTodayContainer)
}

//creating function to search registration when a registration number is typed in to the text field
const searchRegistration = () => {
    //save the text field current value to searchText variable
    const searchText = registrationSearchID.value;
    //check the searchText is empty or not
    if (searchText !== '') {
        //this means searchText is not empty
        //using ajaxGetRequest to send a GET request and get the particluar registration and save it to the searchResult variable
        searchResult = ajaxGetRequest("Registration/getRegistrationHaveClassToday/" + searchText)

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

            //get the current day with adding 1 and save it to currentDay variable
            var currentDay = new Date().getDay() + 1;
            //loop over batchHasDayList because it can contain one or more timetable
            for (const day of searchResult.batchID.batchHasDayList) {
                //if the current day is equal to a one in the batchHasDayList save it to correctSchedule variable
                if (day.dayID.id === currentDay) {
                    correctSchedule = day;
                    //break the loop
                    break;
                }
            }

            //set the registration status
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

            //set the correct schedule
            searchResultLocation.innerText = correctSchedule.lectureRoomID.name + ", " + correctSchedule.lectureRoomID.floor;
            searchResultSchedule.innerText = correctSchedule.startTime.slice(0, -3) + " to " + correctSchedule.endTime.slice(0, -3);

            //set the payment info
            searchResultOutstanding.innerText = "Rs. " + searchResult.balanceAmount.toLocaleString('en-US', {
                maximumFractionDigits: 2, minimumFractionDigits: 2
            });
            searchResultDue.innerText = "Rs. " + searchResult.balanceAmount.toLocaleString('en-US', {
                maximumFractionDigits: 2, minimumFractionDigits: 2
            });

            if (searchResult.isFullPayment) {
                searchResultPaymentType.innerText = "One Time Payment";
            } else {
                searchResultPaymentType.innerText = "Installments";
            }


        } else {
            //this means searchText is empty
            //remove the searchResultRegistration div
            searchResultRegistration.classList.add('d-none');
            //add placeholder back
            placeholderRegistration.classList.remove('d-none')
            //shows a user msg that no record found
            showCustomModal("No classes available today <br> for the registration : <span class='text-lowercase text-steam-green'>" + searchText + "</span>", "error");

        }
    } else {
        //this means searchText is empty
        //show an user msg
        showCustomModal("Registration Number is required for a search", "warning");
    }


}

//creating function to reset textField and show to placeholder and hide the searchResultRegistration div
const registrationSearchReset = () => {
    //reset value
    registrationSearchID.value = '';
    //hide searchResultRegistration div
    searchResultRegistration.classList.add('d-none');
    //show placeholder
    placeholderRegistration.classList.remove('d-none')
}

//creating a function to submit new attendance
const addAttendance = () => {
    //get user confirmation
    showCustomConfirm("You are about to mark attendance for registration number : <span class='text-steam-green'>" + searchResult.registrationNumber + "</span><br>in the <span class='text-steam-green'>" + searchResult.batchID.batchCode + "</span> batch<br><br>Are You Sure?", function (result) {
        //if user click yes
        if (result) {
            //create a new object
            newAttedance = {};
            //set values for the newAttendance object
            newAttedance.registrationID = searchResult;
            newAttedance.batchID = searchResult.batchID.id;

            //using ajaxHttpRequest to send the data to backend and save the response from the server to serverResponse variable
            let serverResponse = ajaxHttpRequest("/Attendance", "POST", newAttedance);
            //if the response is "OK"
            if (serverResponse === "OK") {
                //this means data is saved successfully to the database
                //show user success msg
                showCustomModal("Attendance Successfully Saved!", "success");
                //use registrationSearchReset to reset searchText field
                registrationSearchReset();
                //use refreshBatchSchedulesForToday refresh batches
                refreshBatchSchedulesForToday();

            } else {
                //this means data isn't saved successfully to the database
                //show user msg with the reason
                showCustomModal("Operation Failed!<br/>" + serverResponse, "error");
            }

        } else {
            //user click no
            //show the msg the operation is cancelled
            showCustomModal("Operation Cancelled!", "info");
        }
    });

}