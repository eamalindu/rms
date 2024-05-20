//Reusable Component
//this external Common Function can be used for multiple instances
//instead of writing multiple code segments we can minimize the codes by writing a common validator that can be used at any place


//This function will fill the data into select (dropdowns)
//This function has three arguments
//1) elementID -> ID of the select (dropdown)
//2) message -> default Selected Option text
//3) dataList -> option values in an array
//This function is called using window.load event handler
//civilStatusDataList = [{id:1,name:'Single'},{id:2,name:'Married'},{id:3,name:'Divorced'}]
//Example -> fillSelectOptions(civilStatus,'Please Select Your Civil Status',civilStatusDataList);
const fillSelectOptions = (elementID, message, dataList, displayProperty, selectedValue) => {
    const selectElement = elementID;
    selectElement.innerHTML = '';
    if (message !== '') {
        const optionDefault = document.createElement('option');
        optionDefault.innerText = message;
        optionDefault.value = '';
        optionDefault.selected = true;
        optionDefault.disabled = true;
        selectElement.appendChild(optionDefault);
    }

    dataList.forEach(ob => {
        const option = document.createElement('option');
        option.innerText = ob[displayProperty];
        //converting JavaScript values to JSON strings
        option.value = JSON.stringify(ob);
        if (selectedValue == ob[displayProperty]) {
            option.selected = "selected";
        }
        selectElement.appendChild(option);
    })


}
//This function will get the data from the database
//This function has only one argument
//1) url -> java mapping (service url)
//This function will return the data as an array

const fillMultiSelectOptions = (elementID, message, dataList, displayProperty, selectedValueArray) => {
    const selectElement = elementID;
    selectElement.innerHTML = '';
    if (message !== '') {
        const optionDefault = document.createElement('option');
        optionDefault.innerText = message;
        optionDefault.value = '';
        optionDefault.selected = true;
        optionDefault.disabled = true;
        selectElement.appendChild(optionDefault);
    }
    dataList.forEach(ob => {
        const option = document.createElement('option');
        option.innerText = ob[displayProperty];
        // Converting JavaScript values to JSON strings
        option.value = JSON.stringify(ob);

        // Check if the current option should be selected
        if (selectedValueArray.some(sel => sel.id === ob.id)) {
            option.selected = true;
        }

        selectElement.appendChild(option);
    });

}
//Example -> ajaxGetRequest("/employee/findall")
const ajaxGetRequest = (url) => {
    $('.loading-overlay').show();
    let Response;
    $.ajax(url, {
        async: false, type: "Get", contentType: "json", success: function (data) {
            console.log(data);
            Response = data;
        }, error: function (resOb) {
            alert("error" + resOb);
            Response = resOb;
        }, complete: function () {
            // Hide loading animation
            $('.loading-overlay').hide();
        }

    });
    return Response;

}

const ajaxHttpRequest = (url, method, dataObject) => {
    let serviceRequestResponse;

    $.ajax(url, {
        type: method,
        async: false,
        contentType: "application/json",
        data: JSON.stringify(dataObject),
        success: function (data) {
            console.log("success " + data);
            serviceRequestResponse = data;
        },
        error: function (resOb) {
            console.log("Error " + resOb);
            serviceRequestResponse = resOb;
        }
    });
    return serviceRequestResponse;
}

//test code to show all the followups when an inquiry object is given
//need to implement a backend service (to get followup details when an inquiry is given)
//need to ask
const showFollowupCard = (cardData, container) => {

    //remove any static codes/divs
    container.innerHTML = '';

    // Iterate over the cardData array using forEach
    cardData.forEach(data => {
        const [addedDate, addedTime] = data.followUpTime.split("T");
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card rounded-0 mb-2';

        cardDiv.innerHTML = `
        <div class="card-body rounded-0">
            <div class="row">
                <div class="col-auto text-purple small">
                    <i class="fa-solid fa-calendar-day" aria-hidden="true"></i>
                    ${addedDate}
                </div>
                <div class="col-auto text-purple small">
                    <i class="fa-solid fa-clock" aria-hidden="true"></i>
                    ${addedTime}
                </div>
                <div class="col-auto text-purple small">
                    <i class="fa-solid fa-user" aria-hidden="true"></i>
                    ${data.addedBy}
                </div>
                <br>
                <p class="small card-text">${data.content}</p>
            </div>
        </div>
    `;
        // Append the card to the container
        container.appendChild(cardDiv);
    });
}

const createBatchRadioCards = (dataList, functionEx, container) => {
    container.innerHTML = ""; // Clear previous content
    var row = null;
    dataList.forEach((element, index) => {
        if (index % 2 === 0) {
            row = document.createElement("div");
            row.className = "row";
            container.appendChild(row);
        }

        var col = document.createElement("div");
        col.className = "col-md-6"; // Bootstrap column class for medium devices (2 columns per row)
        var cardDiv = document.createElement("div");
        cardDiv.onclick = () => {
            functionEx(element, index);
        };
        cardDiv.className = "card mb-3 rounded-0 custom-card-active custom-card batch-card";

        if (element.batchStatusID.name === "Scheduled") {
            cardDiv.classList.add('border', 'border-success')
        } else {
            cardDiv.classList.add('border', 'border-warning')
        }

        cardDiv.innerHTML = `
        <div class="card-header text-center">
            <h6 class="mb-0 batch-title text-teal small">${element.isWeekday ? "Weekday" : "Weekend"} / ${element.courseID.name}</h6>
            <span class="text-uppercase"><small>${element.batchCode}</small></span>
        </div>
        <div class="card-body p-0">
            <div class="clearfix border-bottom">
                <div class="w-50 py-3 float-start text-center border-end">
                    <div class="mx-auto d-flex justify-content-center align-items-center bg-secondary text-white" style="width:50px;height:50px;font-size:1.6rem"><strong>${element.seatCountAvailable}</strong></div>
                    <div class="text-muted small"><small>Seats Available</small></div>
                </div>
                <div class="w-50 float-start">
                    <div class="text-center small border-bottom p-1">
                        <span class="date-starts small text-steam-green" style="font-size:0.8rem">${element.commenceDate}</span><br/>
                        <small class="text-muted text-nowrap">Batch Commence Date</small>
                    </div>
                    <div class="text-center small p-1">
                        <span class="date-starts small text-red" style="font-size:0.8rem">${element.lastRegDate}</span><br/>
                        <small class="text-muted text-nowrap">Registration Closing Date</small>
                    </div>
                </div>
            </div>
            <div class="w-100 text-center bg-custom-white fw-normal small p-2 text-muted">${element.description}</div>
        </div>
        <div class="card-footer show rounded-0 text-uppercase border-0 m-0 text-center ${element.batchStatusID.name === "Scheduled" ? "bg-success text-white" : "bg-warning text-white"}">${element.batchStatusID.name}</div>`;

        cardDiv.style.cursor = "pointer"; // Ensure cursor changes to pointer on hover
        cardDiv.addEventListener("click", function () {
            // Reset background color of all cards
            var allCards = document.querySelectorAll(".batch-card");
            allCards.forEach((card) => {
                card.classList.remove('border', 'custom-card-active',"custom-card-active-checkmark");
                card.classList.add('border', 'custom-card-inactive');

            });
            // Set background color of the clicked card
            cardDiv.classList.add('custom-card-active',"custom-card-active-checkmark");
            cardDiv.classList.remove('custom-card-inactive');

        });

        col.appendChild(cardDiv);
        row.appendChild(col);
    });
}

const createCourseRadioCards = (dataList, functionEx, container) => {

    container.innerHTML = ""; // Clear previous content
    var row = null;
    dataList.forEach((element, index) => {
        if (index % 4 === 0) {
            row = document.createElement("div");
            row.className = "row";
            container.appendChild(row);
        }

        var col = document.createElement("div");
        col.className = "col-md-3"; // Bootstrap column class for medium devices (2 columns per row)
        var cardDiv = document.createElement("div");
        cardDiv.onclick = () => {
            functionEx(element, index);
        };
        cardDiv.className =
            "card mb-3 w-100 rounded-0 custom-card-active custom-card course-card";
        cardDiv.innerHTML = `
          <div class="card-body p-1">
            <div class="d-flex">
            <div class="w-25">
                <img src="/resources/images/placeholderlogo.png" width="100px">
            </div>
            <div class="w-100 d-flex align-items-center justify-content-center">
                <div class="text-center">
                <h5 class="small text-center fw-bold">${element.name} <span class="text-muted">(${element.code})</span></h5>
                <span class="small m-0">${element.duration} Months | ${element.minimumRequirement}<br>Lecture Hours: ${element.lectureHours}</span>
            </div>
            </div>
          `;

        cardDiv.style.cursor = "pointer"; // Ensure cursor changes to pointer on hover
        cardDiv.addEventListener("click", function () {
            // Reset background color of all cards
            var allCards = document.querySelectorAll(".course-card");
            allCards.forEach((card) => {
                card.classList.remove("border","border-dark", "custom-card-active","custom-card-active-checkmark");
                card.classList.add("border", "custom-card-inactive");
            });
            // Set background color of the clicked card
            cardDiv.classList.add("custom-card-active","border-dark","custom-card-active-checkmark");
            cardDiv.classList.remove("custom-card-inactive");
        });

        col.appendChild(cardDiv);
        row.appendChild(col);
    });
}

const createStudentRadioCards = (dataList, functionEx,container)=>{
    if(dataList!=="") {
        container.innerHTML = "<p class='text-muted'>Results From Student Database</p>"; // Clear previous content

        row = document.createElement("div");
        row.className = "row p-2";
        container.appendChild(row);

        var col = document.createElement("div");
        col.className = "col-md-6"; // Bootstrap column class for medium devices (2 columns per row)
        var cardDiv = document.createElement("div");
        cardDiv.onclick = () => {
            functionEx(dataList);
        };
        cardDiv.className =
            "card w-100 rounded-0 custom-card-active custom-card student-card";
        cardDiv.innerHTML = `
          <div class="card-body p-1">
            <div class="d-flex">
            <div class="w-25">
                <img src="/resources/images/placeholderstudent.png" width="100px">
            </div>
            <div class="w-100 d-flex align-items-center justify-content-center">
                <div class="">
                <h6 class="fw-bold text-steam-green m-0">${dataList.title} ${dataList.nameWithInitials}</h6>
                <p class="small m-0 text-start fw-bold"><small>${dataList.studentNumber}</small></p>
                <p class="small m-0 text-muted text-start"><small><i class="fa fa-phone-alt fa-sm"></i> ${dataList.mobileNumber}</small></p>
                <p class="small m-0 text-muted text-start"><small><i class="fa fa-envelope fa-sm"></i>  ${dataList.email == null ? 'n/a' : dataList.email}</small></p>
            </div>
            </div>
          `;

        cardDiv.style.cursor = "pointer"; // Ensure cursor changes to pointer on hover
        cardDiv.addEventListener("click", function () {
            // Reset background color of all cards
            var allCards = document.querySelectorAll(".student-card");
            allCards.forEach((card) => {
                card.classList.remove("border", "border-success", "custom-card-active", "custom-card-active-checkmark");
                card.classList.add("border", "custom-card-inactive");
            });
            // Set background color of the clicked card
            cardDiv.classList.add("custom-card-active", "border-success", "custom-card-active-checkmark");
            cardDiv.classList.remove("custom-card-inactive");
        });

        col.appendChild(cardDiv);
        row.appendChild(col);

    }
    else{
        container.innerHTML = '<p class="text-red text-center small">No Records Found For <b>'+studentSearchID.value+'</b> in the Exsisting Student Database! </p>';
    }
}

const fillSelectOptionsWithTwo = (elementID, message, dataList, displayProperty1, displayProperty2, selectedValue) => {
    const selectElement = elementID;
    selectElement.innerHTML = '';
    if (message !== '') {
        const optionDefault = document.createElement('option');
        optionDefault.innerText = message;
        optionDefault.value = '';
        optionDefault.selected = true;
        optionDefault.disabled = true;
        selectElement.appendChild(optionDefault);
    }

    dataList.forEach(ob => {
        const option = document.createElement('option');
        option.innerText = ob[displayProperty1] + " [" + ob[displayProperty2] + "]";
        //converting JavaScript values to JSON strings
        option.value = JSON.stringify(ob);
        if (selectedValue == ob[displayProperty1]) {
            option.selected = "selected";
        }
        selectElement.appendChild(option);
    })

}

//function to toggle the visibility of the table when the h5 tag is clicked
const toggleRegistrationSheetTable =(HeadingTextID,TableID,iconSpanID)=>{
    HeadingTextID.addEventListener("click",()=>{
        if(TableID.style.display!=="none"){
            TableID.style.display = 'none';
            iconSpanID.innerHTML = '<i class="fa-solid fa-circle-chevron-down"></i>'
            HeadingTextID.classList.remove('border-bottom-0');
        }
        else{
            TableID.style.display = 'table';
            iconSpanID.innerHTML = '<i class="fa-solid fa-circle-chevron-up"></i>'
            HeadingTextID.classList.add('border-bottom-0');
        }

    })
}