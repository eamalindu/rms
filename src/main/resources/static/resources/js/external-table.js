//Reusable Component
//this external Table Function can be used for multiple instances
//instead of writing multiple code segments we can minimize the codes by writing a common validator that can be used at any place

//create a function for fill data into table
//1 parameter -> table id
//2 parameter -> data array list
//3 parameter -> display Property List (Column headers)
const fillDataIntoTable = (tabledID, dataList, displayPropertyList,viewFunction,offCanvasID) => {
    //access the table via querySelector
    //const table = document.querySelector('#tblEmp');

    //children 0 -> thead
    //children 1 -> tbody
    const tbody = tabledID.children[1];
    //clear the table body
    tbody.innerHTML = '';

    dataList.forEach((element, index) => {

        //creating a tr element
        const tr = document.createElement('tr');

        //there are seven columns in the table, so we have to create seven tds
        const tdIndex = document.createElement('td');
        //use foreach loop to add text to the created tds
        tdIndex.innerText = index + 1;
        //append the remaining tds to the tr
        tr.appendChild(tdIndex);

        displayPropertyList.forEach((ob, ind) => {
            const td = document.createElement('td');

            //if datatype is text, get the property from the displayPropertyList and use that property to get the value from the employee array
            if (ob.dataType === 'text') {
                //template -> element[ob.displayPropertyListColumnName] = element['fullName']
                td.innerText = element[ob.property];
            }
            if (ob.dataType === 'function') {
                //calling the getEmployeeStatus function and passing records of employee array one by one
                td.innerHTML = ob.property(element);
            }

            tr.appendChild(td);
        })

        /*
        const tdFullName = document.createElement('td');
        const tdNic = document.createElement('td');
        const tdEmail = document.createElement('td');
        const tdMobile = document.createElement('td');
        const tdStatus = document.createElement('td');
         */

        const tdModify = document.createElement('td');

        //there are 3 buttons, so create them as well
        const btnView = document.createElement('button');

        //const btnDelete = document.createElement('button');
        //const btnView = document.createElement('button');

        //add relevant classes for the created buttons
        btnView.classList.add('btn','p-0', 'fw-bold', 'text-purple','btn-sm');

        //setting attribute to btnEdit so that it will trigger the offcanvas
        btnView.setAttribute('data-bs-target',`#${offCanvasID}`);
        btnView.setAttribute('data-bs-toggle','offcanvas');

       // btnDelete.classList.add('btn', 'custom-btn', 'bg-danger', 'ms-2');
        //btnView.classList.add('btn', 'custom-btn', 'bg-success', 'ms-2');
        //Alternative Method
        //btnEdit.ClassName = 'btn custom-btn bg-warning';

        //add text,icons using innerHTML for each button
        btnView.innerHTML = 'View';

        //btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
        //btnView.innerHTML = '<i class="fa-solid fa-eye"></i>';

        //onlick function for buttons
        btnView.onclick = ()=>{
            viewFunction(element,index);
        }
        /*
        btnView.onclick = () =>{
           printFunction(element,index);
        }
        btnDelete.onclick = ()=>{
            deleteFunction(element,index);
        }

         */

        //template -> element.columnName
        /*
        tdFullName.innerText = element.fullName;
        tdNic.innerText = element.nic;
        tdEmail.innerHTML = element.email;
        tdMobile.innerHTML =  element.mobile

        //employeeStatus is an object
        //get its value -> object.columnName;
        tdStatus.innerHTML = element.employeeStatus.name;
         */

        //append buttons to the td that's dedicated for the buttons
        tdModify.appendChild(btnView);
        //tdModify.appendChild(btnDelete);
        //tdModify.appendChild(btnView);


        /* tr.appendChild(tdFullName);
         tr.appendChild(tdNic);
         tr.appendChild(tdEmail);
         tr.appendChild(tdMobile);

         tr.appendChild(tdStatus); */

        tr.appendChild(tdModify);

        //append the tr to tbody
        tbody.appendChild(tr);


    });
}