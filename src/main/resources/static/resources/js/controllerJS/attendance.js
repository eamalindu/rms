window.addEventListener("load", function () {

    const batchesConductingToday = ajaxGetRequest("Batch/getBatchesConductToday")
    createBatchesConductingToday(batchesConductingToday,batchesTodayContainer)

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
    if (dataList.length < 0) {
        //This means dataList is not empty
        //using forEach function to loop over the contents of the dataList array
        dataList.forEach((element, index) => {
            //create a div and save it in the div variable
            var div = document.createElement('div');
            //add relevant class names to div
            div.className = 'container border d-flex p-3 mb-2';

        })
    } else {
        //This means dataList is empty
    }

}