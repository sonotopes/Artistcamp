// original file to populate FK dropdown on Release and other pages

async function getData() {
    const response = await fetch("/customers-json");
    const data = await response.json();
    console.log("here's data", data.data);

    const selectAdd = document.getElementById("mySelectAdd");
    const selectUpdate = document.getElementById("mySelectOrderUpdateCustomer");


    const customerData = data.data;

    for (let index = 0; index<customerData.length; index++){
        let customerOption = document.createElement("option");
        let customer = customerData[index];

        customerOption.value = customer.customerID;
        customerOption.text = customer.customerID;
        
        selectAdd.appendChild(customerOption);
        
    }

    for (let index = 0; index<customerData.length; index++){
        let customerOption = document.createElement("option");
        let customer = customerData[index];

        customerOption.value = customer.customerID;
        customerOption.text = customer.customerID;

        selectUpdate.appendChild(customerOption);
        
    }


}

getData();