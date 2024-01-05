// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form-ajax');


// Modify the objects we need
addOrderForm.addEventListener("submit", function (event) {
    
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    //let inputOrderID = document.getElementById("mySelectAdd");
    let inputCustomerID = document.getElementById("mySelectAdd");
    let inputOrderDate = document.getElementById("input-orderDate");
    let inputTotalPrice = document.getElementById("input-totalPrice");
    let inputSalesTax = document.getElementById("input-salesTax");

    // Get the values from the form fields
    //let orderIDValue = inputOrderID.value;
    let customerIDValue = inputCustomerID.value !== "" ? inputCustomerID.value : null;
    let orderDateValue = inputOrderDate.value.toLocaleString("default", {year: "numeric"});
    let totalPriceValue = inputTotalPrice.value;
    let salesTaxValue = inputSalesTax.value;

    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerIDValue,
        orderDate: orderDateValue,
        totalPrice: totalPriceValue, 
        salesTax: salesTaxValue,
    }

    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/add-order-ajax', true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction

            inputCustomerID = null;
            inputOrderDate = null;
            inputTotalPrice = null;
            inputSalesTax = null;

        
    }
    else if (xhttp.readyState == 4 && xhttp.status != 200) {
        console.log("There was an error with the input.")
    }}

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from entity. 
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("order-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log(newRow);

    // Create a row and cells
    let row = document.createElement("TR");

    let idCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let orderDateCell = document.createElement("TD");
    let totalPriceCell = document.createElement("TD");
    let salesTaxCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");
    // Fill the cells with correct data
    idCell.innerText = newRow.orderID;
    customerIDCell.innerText = newRow.customerID;
    orderDateCell.innerText = newRow.orderDate;
    totalPriceCell.innerText = newRow.totalPrice;
    salesTaxCell.innerText = newRow.salesTax;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteOrder(newRow.orderID);
    };
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(customerIDCell);
    row.appendChild(orderDateCell);
    row.appendChild(totalPriceCell);
    row.appendChild(salesTaxCell);
     row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.orderID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelectOrderUpdateOrder");
    let option = document.createElement("option");
    option.text = newRow.orderID;
    option.value = newRow.orderID;
    selectMenu.add(option);
}