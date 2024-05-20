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

const searchRegistration = ()=>{

    const searchText = registrationSearchID.value;
    if (searchText !== '') {
       let searchResult = ajaxGetRequest("Registration/getRegistrationHaveClassToday/" +searchText)

        if(searchResult!==''){
            searchResultRegistration.classList.remove('d-none');
            placeholderRegistration.classList.add('d-none')

            //set the details
            searchResultStudentName.innerText = searchResult.studentID.title +" "+searchResult.studentID.nameWithInitials;
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

            searchResultLocation.innerText = correctSchedule.lectureRoomID.name +", "+correctSchedule.lectureRoomID.floor;
            searchResultSchedule.innerText = correctSchedule.startTime.slice(0,-3) +" to "+ correctSchedule.endTime.slice(0,-3);

            searchResultOutstanding.innerText = "Rs. "+searchResult.balanceAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
            searchResultDue.innerText = "Rs. "+searchResult.balanceAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});

            if(searchResult.isFullPayment){ searchResultPaymentType.innerText = "One Time Payment";}
            else{searchResultPaymentType.innerText = "Installments";}


        }
        else{
            searchResultRegistration.classList.add('d-none');
            placeholderRegistration.classList.remove('d-none')
            showCustomModal("No classes available today <br> for the registration : <span class='text-lowercase text-steam-green'>"+searchText+"</span>","error");

        }
    }
    else{
        showCustomModal("Registration Number is required for a search", "warning");
    }


}

const registrationSearchReset = ()=>{
    registrationSearchID.value = '';
    searchResultRegistration.classList.add('d-none');
    placeholderRegistration.classList.remove('d-none')
}