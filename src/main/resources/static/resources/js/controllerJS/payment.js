window.addEventListener('load', () => {
    resetSearchForm();
    refreshPaymentTable();
})

const resetSearchForm = () => {
    var start = moment().startOf('month');
    var end = moment().endOf('month');

    function cb(start, end) {
        $('#registrationSearchDateRange span').html(start.format('YYYY-MMMM-DD') + ' - ' + end.format('YYYY-MMMM-DD'));
    }

    $('#registrationSearchDateRange').daterangepicker({
        startDate: start, endDate: end,
        locale: {
            "format": "YYYY-MM-DD",
        }, ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
        }
    }, cb);

    cb(start, end);

}

const refreshPaymentTable = ()=>{
    [startDate,endDate] = registrationSearchDateRange.value.split(" - ")
    const payments = ajaxGetRequest("/Payment/getPaymentsByStartDateAndEndDate/"+startDate+"/"+endDate);
    const displayPropertyListForPayments = [
        {property: 'addedBy', dataType: 'text'},
        {property: getPaymentMethod, dataType: 'function'},
        {property: getTimeStamp, dataType: 'function'},
        {property: getRegistration, dataType: 'function'},
        {property: getStudentName, dataType: 'function'},
        {property: getBatch, dataType: 'function'},
        {property: 'invoiceCode', dataType: 'text'},
        {property: getAmount, dataType: 'function'},
    ];
    fillDataIntoTable(tblPayment,payments,displayPropertyListForPayments,rowView,'offcanvasPaymentSheet');
}

const getPaymentMethod = (ob)=>{
    return ob.paymentTypeID.name;
}

const getTimeStamp = (ob)=>{
    return ob.timeStamp.replace('T','&nbsp;&nbsp;');
}

const getRegistration = (ob)=>{
    return ob.registrationID.registrationNumber;
}

const getStudentName = (ob)=>{
    return ob.registrationID.studentID.nameWithInitials;
}

const getBatch = (ob)=>{
    return ob.registrationID.courseID.name;
}

const getAmount = (ob)=>{
    return "Rs. "+ob.amount.toLocaleString('en-US',{maximumFractionDigits: 2,minimumFractionDigits: 2})
}

const rowView = (ob)=>{
//hide the update btn
    btnPaymentSheetUpdate.style.display = 'none';

    //get all the inputs with the class name markSheetInputs and save it as an array
    inputs = document.querySelectorAll('.paymentSheetInputs');
    //using forEach Function to remove inline styles,boostrap validation classes and set the disabled property to true
    inputs.forEach(function (input) {
        //add the attribute disabled to make inputs block the user input values
        //remove the edited border colors from the inputs
        input.setAttribute('disabled', 'true');
        input.style = '';
        //remove bootstrap validation classes
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
    });

    //set data
    paymentSheetCashier.innerText = ob.addedBy;
    paymentSheetBatch.innerText = ob.registrationID.batchID.batchCode;
    paymentSheetCourse.innerText = ob.registrationID.courseID.name;
    paymentSheetRegistrationNumber.innerText = ob.registrationID.registrationNumber;
    paymentSheetStudentName.innerText =ob.registrationID.studentID.nameWithInitials;
    //set editable data
    const paymentMethods = ajaxGetRequest("/PaymentType/findall");
    fillSelectOptions(paymentSheetMethod,' ',paymentMethods,'name',ob.paymentTypeID.name);
    paymentSheetAmount.value = ob.amount;

    //catching current object to compare them
    editedPayment = JSON.parse(JSON.stringify(ob));
    oldPayment  = JSON.parse(JSON.stringify(ob));
}

const paymentEdit = ()=>{
    //getting the toast from its ID
    var myToastEl = document.getElementById('myToast');
    var myToast = new bootstrap.Toast(myToastEl);
    //Displaying toast
    myToast.show();
    //hide the toast after 5s
    setTimeout(function () {
        myToast.hide();
    }, 5000);

    //display the update button once the edit button is clicked
    btnPaymentSheetUpdate.style.display = 'block';

    //remove the attribute readonly to make inputs accept the user input values
    //give a border color to inputs indicate that the input's values are ready to be edited
    inputs = document.querySelectorAll('.paymentSheetInputs');

    //remove the disabled attribute from the select
    //give a border color to indicate that select can be now edited

    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
        input.setAttribute('style', 'border:1px solid #0DCAF0!important;background-color:rgba(13,202,240,0.2);');
    });
}

const paymentUpdate = ()=>{

    console.log(editedPayment);

    //calling the checkMarkFormErrors function and catching the return value to errors variable
    let errors = checkMarkFormPayment(editedPayment);
    //check the errors variable is null
    //if it's null that means all the required inputs are filled
    if (errors === '') {
        //calling the checkForPrivilegeUpdate function and catching the return value to updates variable
        let updates = checkForPaymentUpdate();
        //check the updates variable is null
        //if it's null that means there are no any updates
        if (updates === '') {
            showCustomModal("No changes Detected!", "info");
        } else {
            showCustomConfirm("You are About to Update this Batch<br><br>Following Changes Detected!<br/><br/><small>" + updates + "</small><br>Are You Sure?", function (result) {
                //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                //catch the return value from the backend and save it in the serviceResponse variable
                if (result) {
                    //if the user confirmation is "yes" call the ajaxHttpRequest to pass the data to backend via ajax
                    //catch the return value from the backend and save it in the serviceResponse variable
                    let serverResponse = ajaxHttpRequest("/Payment","PUT",editedPayment);
                    //check the serviceResponse value is "OK"
                    if (serverResponse === "OK") {
                        //this means data successfully passed to the backend
                        //show an alert to user
                        showCustomModal("Payment Successfully Updated!", "success");
                        //close the offCanvas sheet
                        offcanvasPaymentSheetCloseBtn.click();
                        //refresh table
                        refreshPaymentTable();

                    } else {
                        showCustomModal("Operation Failed!" + serverResponse, "error")
                    }


                } else {
                    showCustomModal("Operation Cancelled!", "info");
                }
            });
        }

    } else {
        //there are errors
        //display them to the user using external-ModalFunction()
        showCustomModal(errors, 'warning');

    }

}

const checkMarkFormPayment = (object)=>{
    let errors = '';
    if (object.amount === null) {
        errors += 'Payment Method is Required<br>';
    }
    if (object.paymentTypeID.id === '') {
        errors += 'Amount is Required<br>';
    }
    return errors;
}

const checkForPaymentUpdate = ()=>{
    let updates = '';
    if (editedPayment.paymentTypeID.id !== oldPayment.paymentTypeID.id) {
        updates = updates + "Payment Type was changed to <span class='text-steam-green'>" + oldPayment.paymentTypeID.name + "</span><br>";
    }
    if (editedPayment.amount !== oldPayment.amount) {
        updates = updates + "Amount was changed to <span class='text-steam-green'>" + oldPayment.amount + "</span><br>";
    }
    return updates;
}