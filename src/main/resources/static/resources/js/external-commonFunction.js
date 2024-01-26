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
const fillSelectOptions = (elementID, message, dataList,displayProperty,selectedValue) => {
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
        if(selectedValue==ob[displayProperty]){
            option.selected = "selected";
        }
        selectElement.appendChild(option);
    })


}
//This function will get the data from the database
//This function has only one argument
//1) url -> java mapping (service url)
//This function will return the data as an array

const fillMultiSelectOptions=(elementID, message, dataList,displayProperty,selectedValueArray)=>{
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
const ajaxGetRequest = (url) =>{
    $('.loading-overlay').show();
    let Response;
    $.ajax(url, {
        async: false,
        type: "Get",
        contentType: "json",
        success: function (data) {
            console.log(data);
            Response = data;
        },
        error: function (resOb) {
            alert("error" + resOb);
            Response = resOb;
        },
        complete: function () {
            // Hide loading animation
            $('.loading-overlay').hide();
        }

    });
    return Response;

}

const ajaxHttpRequest = (url,method,dataObject)=>{
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
const showFollowupCard =(cardData,container)=>{

    //remove any static codes/divs
    container.innerHTML='';

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
