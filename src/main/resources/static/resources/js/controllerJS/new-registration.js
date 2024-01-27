//get all the steppers
let step1 = document.querySelector('#btn-course');
let step2 = document.querySelector('#btn-batch');
let step3 = document.querySelector('#btn-payment-str');
let step4 = document.querySelector('#btn-student');
let step5 = document.querySelector('#btn-add-payment');

//get all the footers
let footer_1 = document.querySelector('#step-course');
let footer_2 = document.querySelector('#step-batch');
let footer_3 = document.querySelector('#step-payment-str');
let footer_4 = document.querySelector('#step-student');
let footer_5 = document.querySelector('#step-add-payment');

let next0 = () => {
    //bard generated
    const radioButtons = document.querySelectorAll('input[type="radio"][name="btnradio"]');
    function validateRadioButtons() {
        let selectedRadioButton = null;
        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                selectedRadioButton = radioButton;
                break;
            }
        }

        if (selectedRadioButton === null) {
           showCustomModal('Please Select a Course to Continue','warning')
            return false;
        }

        return true;
    }

    if(validateRadioButtons()) {

        //footer_1 should have a selected at least one before executing the bellow code
        footer_1.classList.remove('show');
        footer_2.classList.add('show');
        step1.classList.add('custom-step-complete');
        document.querySelector('#btn-course .step-number span').innerText = '✔';
    }

}
let next1 = () => {
    //footer_2 should have a selected at least one before executing the bellow code
    footer_2.classList.remove('show');
    footer_3.classList.add('show');
    step2.classList.add('custom-step-complete');
    document.querySelector('#btn-batch .step-number span').innerText = '✔';
}
let next2 = () => {
    footer_3.classList.remove('show');
    footer_4.classList.add('show');
    step3.classList.add('custom-step-complete');
    document.querySelector('#btn-payment-str .step-number span').innerText = '✔';

}

let next3= ()=>{
    footer_4.classList.remove('show');
    footer_5.classList.add('show');
    step4.classList.add('custom-step-complete');
    document.querySelector('#btn-student .step-number span').innerText = '✔';


}
let next4= ()=>{
    step5.classList.add('custom-step-complete');
    document.querySelector('#btn-add-payment .step-number span').innerText = '✔';

    //add print receipt logic here
}
let previous0 = () => {
    step1.classList.remove('custom-step-complete');
    step2.classList.remove('custom-step-complete');
    step3.classList.remove('custom-step-complete');
    step4.classList.remove('custom-step-complete');
    step5.classList.remove('custom-step-complete');

    footer_1.classList.add('show');
    footer_2.classList.remove('show');
    footer_3.classList.remove('show');
    footer_4.classList.remove('show');
    footer_5.classList.remove('show');

    document.querySelector('#btn-course .step-number span').innerText = '1';
    document.querySelector('#btn-batch .step-number span').innerText = '2';
    document.querySelector('#btn-payment-str .step-number span').innerText = '3';
    document.querySelector('#btn-student .step-number span').innerText = '4';
    document.querySelector('#btn-add-payment .step-number span').innerText = '5';

}
let previous1 = () => {
    //footer_1 value should be present in order to execute the following code -> use if
    step2.classList.remove('custom-step-complete');
    step3.classList.remove('custom-step-complete');
    step4.classList.remove('custom-step-complete');
    step5.classList.remove('custom-step-complete');



    footer_1.classList.remove('show');
    footer_2.classList.add('show');
    footer_3.classList.remove('show');
    footer_4.classList.remove('show');
    footer_5.classList.remove('show');

    document.querySelector('#btn-batch .step-number span').innerText = '2';
    document.querySelector('#btn-payment-str .step-number span').innerText = '3';
    document.querySelector('#btn-student .step-number span').innerText = '4';
    document.querySelector('#btn-add-payment .step-number span').innerText = '5';



}
let previous2 = () => {
    step3.classList.remove('custom-step-complete');
    step4.classList.remove('custom-step-complete');
    step5.classList.remove('custom-step-complete');


    footer_1.classList.remove('show');
    footer_2.classList.remove('show');
    footer_3.classList.add('show');
    footer_4.classList.remove('show');
    footer_5.classList.remove('show');

    document.querySelector('#btn-payment-str .step-number span').innerText = '3';
    document.querySelector('#btn-student .step-number span').innerText = '4';
    document.querySelector('#btn-add-payment .step-number span').innerText = '5';



}
let previous3 = () =>{
    step4.classList.remove('custom-step-complete');
    step5.classList.remove('custom-step-complete');


    footer_1.classList.remove('show');
    footer_2.classList.remove('show');
    footer_3.classList.remove('show');
    footer_4.classList.add('show');
    footer_5.classList.remove('show');

    document.querySelector('#btn-student .step-number span').innerText = '4';
    document.querySelector('#btn-add-payment .step-number span').innerText = '5';

}

//input validation (search student)
let input_search_student = document.querySelector('#input-search-student');
input_search_student.addEventListener('keyup',()=>{
    const pattern = '^[0][7][01245678][0-9]{7}$';
    const regexPattern = new RegExp(pattern);

    if(regexPattern.test(input_search_student.value)){
        input_search_student.classList.add('is-valid');
        input_search_student.classList.remove('is-invalid')
    }
    else{
        input_search_student.classList.remove('is-valid');
        input_search_student.classList.add('is-invalid');

    }
});