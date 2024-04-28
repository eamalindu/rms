//Reusable Component
//this external validator can be used for multiple instances
//instead of writing multiple code segments we can minimize the codes by writing a common validator that can be used at any place


//This function have four arguments
// 1) element -> use 'this'
// 2) regex pattern (in string format) -> use '^$'
// 3) Object -> The object that data should bind
// 4) property -> object property
//This function is called using onclick event handler
//Example -> onclick="inputTextValidator(this,'^[A-Z][a-z]{2,19}$','employee','fullName')"
const inputTextValidator = (element, pattern,object,property) => {

    //checking for element value (value cant be null)
    if (element.value !== '') {

        //if the regex pattern is satisfying by the element value, display a green border or add boostrap validation class 'is-valid'
        if (new RegExp(pattern).test(element.value)) {

            element.style.border = '1px solid green';
            element.style.background = 'white';
            element.style.color='green';
            element.classList.add('is-valid');
            element.classList.remove('is-invalid');

           window[object][property] = element.value;

        }
        //if the regex pattern is not satisfying by the input value, by the element value display a red border or add boostrap validation class 'is-invalid'
        else {

            window[object][property] = null;
            element.style.border = '1px solid red';
            element.style.background = 'white';
            element.style.color='red';

            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
        }
    }
    //if the element is null, check if its required or not
    else {

       window[object][property] = null;

        //if element is required, display error / warning (use border color or boostrap validation)
        if (element.required) {
            element.style.border = '1px solid red';
            element.style.background = 'white';
            element.style.color='red';

            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
        }
        //if the element is not required, display the default colors (remove boostrap validation)
        else {
            element.style.border = '1px solid #ced4da';
            element.style.background = 'white';
            element.style.color='black';
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid');


        }
    }

}

const inputDateTimeValidator = (element, pattern,object,property) => {
    //checking for element value (value cant be null)
    if (element.value !== '') {

        //if the regex pattern is satisfying by the element value, display a green border or add boostrap validation class 'is-valid'
        if (new RegExp(pattern).test(element.value)) {

            element.style.border = '1px solid green';
            element.style.background = 'white';
            element.style.color='green';

            element.classList.add('is-valid');
            element.classList.remove('is-invalid');

            //This is a temp fix
            //when user add the date and time it saves as string ex: (2023-11-16 19:30)
            //this format is not accepted in java
            //need to change it to iso standard
            //after converting to iso format the time is saved 5h 30min less than the original time ex:(2023-11-16T14:00:00)
            //research 3+hrs couldn't find any answers (with vanilla js) can be done using moments, Luxon js libraries
            //manually added 5h and 30 minutes so that when it converts to iso shows the right time
            //possible fix ->use moment js
            //if there are no solutions, this can be used
            //but update the validator to only accept values in between 8am and 5pm
            const dateStr = element.value;
            const date = new Date(dateStr);

            const hoursToAdd = 5;
            const minutesToAdd = 30;

            date.setHours(date.getHours() + hoursToAdd);
            date.setMinutes(date.getMinutes() + minutesToAdd);

            const formattedDate = date.toISOString();

            window[object][property] = formattedDate;

        }
        //if the regex pattern is not satisfying by the input value, by the element value display a red border or add boostrap validation class 'is-invalid'
        else {

            window[object][property] = null;
            element.style.border = '1px solid red';
            //element.style.background = 'rgba(255,0,0,0.2)';
            element.style.color='red';
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
        }
    }
    //if the element is null, check if its required or not
    else {

        window[object][property] = null;

        //if element is required, display error / warning (use border color or boostrap validation)
        if (element.required) {
            element.style.border = '1px solid red';
            //element.style.background = 'rgba(255,0,0,0.2)';
            element.style.color='red';
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
        }
        //if the element is not required, display the default colors (remove boostrap validation)
        else {
            element.style.border = '1px solid #ced4da';
            element.style.background = 'white';
            element.style.color='black';
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid');
        }
    }
}

//This function have four arguments
// 1) elementID -> use 'id' without quotation or 'this' keyword
// 2) no pattern
// 3) Object -> The object that data should bind
// 4) property -> object property
//This function is called using onchange event handler
//Example -> onchange="selectStaticValueValidator(elementID,'','employee','civilStatus')"
const selectStaticValueValidator = (elementID,pattern,object,property) => {
   if(elementID.value !== ''){
        elementID.style.border = '1px solid green';
       elementID.style.background = 'white';
       elementID.style.color='green';
       elementID.style.paddingRight = '0';
      // elementID.setAttribute('style', 'background:rgba(0,255,0,0.2) !important;border:1px solid green');
       elementID.classList.add('is-valid');
       elementID.classList.remove('is-invalid');
       window[object][property] = elementID.value;

   }
   else{
       elementID.style.border = '1px solid red';
       //elementID.style.background = 'rgba(255,0,0,0.2)';
       elementID.style.color='red';
      // elementID.setAttribute('style', 'background:rgba(255,0,0,0.2) !important;border:1px solid red');
       elementID.classList.remove('is-valid');
       elementID.classList.add('is-invalid');
       window[object][property] = null;
   }
}

const selectDynamicValueValidator = (elementID,pattern,object,property) => {
    if(elementID.value !== ''){
        elementID.style.border = '1px solid green';
        elementID.style.color='green';
        elementID.style.background = 'white';
        elementID.style.paddingRight = '0';
        elementID.classList.add('is-valid');
        elementID.classList.remove('is-invalid');
        window[object][property] = JSON.parse(elementID.value);
    }
    else{
        elementID.style.border = '1px solid red';
        elementID.style.color='red';
        //elementID.style.background = 'rgba(255,0,0,0.2)';

        elementID.classList.remove('is-valid');
        elementID.classList.add('is-invalid');
        window[object][property] = null;
    }
}

const selectDynamicMultiValueValidator = (elementID,object,property) => {
    newElementID = document.querySelector(elementID);
    if(elementID.value !== ''){
        newElementID.style.border = '1px solid green';
        newElementID.style.color='green';
        newElementID.style.background = 'white';
        newElementID.style.paddingRight = '0';
        newElementID.classList.add('is-valid');
        newElementID.classList.remove('is-invalid');
        selectedValues = $(elementID).chosen().val();
        window[object][property] = new Array();
        console.log(typeof window[object][property])
        //newUser.roles = [];
        console.log(selectedValues)
        if(selectedValues!==null){
        selectedValues.forEach(ob=>{
         // newUser.roles.push(JSON.parse(ob))
            window[object][property].push(JSON.parse(ob))
        })
        }

    }
    else{
        newElementID.style.border = '1px solid red';
        newElementID.style.color='red';
        //elementID.style.background = 'rgba(255,0,0,0.2)';

        newElementID.classList.remove('is-valid');
        newElementID.classList.add('is-invalid');
        window[object][property] = null;
    }
}

const inputRadioValidator = (elementID,pattern,labelOne,labelTwo)=>{

    if(elementID.checked){
        labelOne.style.color = 'green';
        labelTwo.style.color = 'black';

    }
    else{
        labelOne.style.color = 'black';
        labelTwo.style.color = 'black';
    }
}

//creating a function for checkbox validate and binding values to the object
//This function have seven arguments
// 1) elementID -> use 'this' or the html id of the checkbox
// 2) leftDivID -> left DIV html id
// 3) rightDivID -> right DIV html id
// 4) object -> The object that data should bind
// 5) property -> object property
// 6) trueValue-> value to bind if checkbox is checked
// 7) falseValue-> value to bind if checkbox is not checked
//This function is called using onclick event handler
const checkBoxValidator = (elementID, leftDivID, rightDivID, object, property, trueValue, falseValue) => {
    //checking if the checkbox is checked or not
    if (elementID.checked) {
        rightDivID.classList.add('bg-success', 'text-white');
        leftDivID.classList.remove('bg-success', 'text-white');
        window[object][property] = trueValue;
    } else {
        window[object][property] = falseValue;
        rightDivID.classList.remove('bg-success', 'text-white');
        leftDivID.classList.add('bg-success', 'text-white');

    }
}