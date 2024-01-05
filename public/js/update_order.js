
// Get the objects we need to modify
let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
    console.log("updating start")
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("mySelectOrderUpdateOrder");
    let inputCustomerID = document.getElementById("mySelectOrderUpdateCustomer");
    let inputDate = document.getElementById("input-orderDateUpdate");
    let inputTotalPrice = document.getElementById("input-totalPriceUpdate");
    let inputSalesTax = document.getElementById("input-salesTaxUpdate");

    // Get the values from the form fields
    let orderIDUpdate= inputOrderID.value;
    let customerIDUpdate= inputCustomerID.value !== "" ? inputCustomerID.value : null;
    let dateUpdate = inputDate.value;

    let totalPriceUpdate = inputTotalPrice.value;
    let salesTaxUpdate = inputSalesTax.value;
   
    // currently the database table does not allow updating values to NULL
    // so we must abort if NULL

    if ((!orderIDUpdate)) 
    {
        return;
    }

    if ((!dateUpdate)) 
    {
        return;
    }

    if ((!totalPriceUpdate)) 
    {
        return;
    }

    if ((!salesTaxUpdate)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDUpdate,
        customerID: customerIDUpdate,
        dateUpdate: dateUpdate,
        totalPrice: totalPriceUpdate,
        salesTax: salesTaxUpdate
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            console.log("response!", xhttp.response)
            // Add the new data to the table
            updateRow(xhttp.response, orderIDUpdate);
            console.log(xhttp.response);
            getCustomerData();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, orderID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("order-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let orderID_row = updateRowIndex.getElementsByTagName("td")[0];
            let customerID_row = updateRowIndex.getElementsByTagName("td")[1]
            let date_row = updateRowIndex.getElementsByTagName("td")[2]
            let totalPrice_row = updateRowIndex.getElementsByTagName("td")[3]
            let salesTax_row = updateRowIndex.getElementsByTagName("td")[4]

            // Reassign to our value we updated to
            console.log("parsed data", parsedData[0]);
            orderID_row.innerHTML = parsedData[0].orderID; 
            customerID_row.innerHTML = parsedData[0].customerID !== null ? parsedData[0].customerID : "Null" ; 
            date_row.innerHTML = parsedData[0].orderDate; 
            totalPrice_row.innerHTML = parsedData[0].totalPrice; 
            salesTax_row.innerHTML = parsedData[0].salesTax; 

       }
    }
}


async function getCustomerData() {
    console.log("updating the customers select")
    const response = await fetch("/customers-json");
    const data = await response.json();
    console.log("here's data", data.data);

    const selectAdd = document.getElementById("mySelectAdd");
    const selectRe = document.getElementById("mySelectOrderUpdateCustomer");
    selectRe.innerHTML = "";

    const customerArray = data.data;
    for (let index = 0; index<customerArray.length; index++){
        let customerOption = document.createElement("option");
        let customer = customerArray[index];

        customerOption.value = customer.customerID;
        customerOption.text = customer.customerID;
        selectRe.appendChild(customerOption);
        
    }
    
    let nullOption = document.createElement("option");
    nullOption.value = ""
    nullOption.text = "Null"
    selectRe.appendChild(nullOption)

    for (let index = 0; index<customerArray.length; index++){
        let customerOption = document.createElement("option");
        let customer = customerArray[index];

        customerOption.value = customer.customerID;
        customerOption.text = customer.customerID;
        selectAdd.appendChild(customerOption);
        
    }
    let nullOptionA = document.createElement("option");
    nullOptionA.value = ""
    nullOptionA.text = "Null"
    selectAdd.appendChild(nullOptionA)
}