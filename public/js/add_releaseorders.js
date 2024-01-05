
let addOrderForm = document.getElementById('add-release-order-form-ajax');


// Modify the objects we need
addOrderForm.addEventListener("submit", function (event) {
    
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    //let inputOrderID = document.getElementById("mySelectAdd");
    let inputReleaseID = document.getElementById("mySelectAddReleaseRO");
    let inputOrderID = document.getElementById("mySelectAddOrderRO");
    let inputPurchasePrice = document.getElementById("input-purchasePrice");


    // Get the values from the form fields
    //let orderIDValue = inputOrderID.value;
    let releaseIDValue = inputReleaseID.value;
    let orderIDValue = inputOrderID.value;
    let purchasePriceValue = inputPurchasePrice.value;

    // Put our data we want to send in a javascript object
    let data = {
        releaseID: releaseIDValue,
        orderID: orderIDValue,
        purchasePrice: purchasePriceValue,
    }

    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/add-release-order-ajax', true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction

            inputReleaseID = null;
            inputOrderID = null;
            inputPurchasePrice = null;

        
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
    let currentTable = document.getElementById("release-order-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log(newRow);

    // Create a row and cells
    let row = document.createElement("TR");

    let idCell = document.createElement("TD");
    let releaseIDCell = document.createElement("TD");
    let orderIDCell = document.createElement("TD");
    let purchasePriceCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");
    // Fill the cells with correct data
    idCell.innerText = newRow.releaseorderID;
    releaseIDCell.innerText = newRow.releaseID;
    orderIDCell.innerText = newRow.orderID;
    purchasePriceCell.innerText = newRow.purchasePrice;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteReleaseOrder(newRow.releaseorderID);
    };
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(releaseIDCell);
    row.appendChild(orderIDCell);
    row.appendChild(purchasePriceCell);
    row.appendChild(deleteCell);
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.releaseorderID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelectReleaseOrderUpdate");
    let option = document.createElement("option");
    option.text = newRow.releaseorderID;
    option.value = newRow.releaseorderID;
    selectMenu.add(option);
}