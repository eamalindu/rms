window.addEventListener("load", function () {

});

//This function will generate batch information that will conduct today
//This function has two arguments
//1) dataList -> data Array which contain actual data from the database
//2) containerID -> element id of where the divs should display
//This function is called using window.load event handler
const createBatchesConductingToday = (dataList, containerID) => {
    containerID.innerHTML = '';
    if (dataList.length < 0) {

        dataList.forEach((element, index) => {
            var div = document.createElement('div');
            div.className = 'container border d-flex p-3 mb-2';

        })
    } else {

    }

}