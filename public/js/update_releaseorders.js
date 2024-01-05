
// Get the objects we need to modify
let updateReleaseOrderForm = document.getElementById('update-release-order-form-ajax');

// Modify the objects we need
updateReleaseOrderForm.addEventListener("submit", function (e) {
    console.log("updating start")
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputReleaseOrderID = document.getElementById("mySelectReleaseOrderUpdate");
    let inputReleaseID = document.getElementById("mySelectReleaseOrderUpdateRelease");
    let inputOrderID = document.getElementById("mySelectReleaseOrderUpdateOrder");
    let inputPurchasePrice = document.getElementById("input-purchasePriceUpdate");
   
    // Get the values from the form fields
    let releaseorderIDUpdate= inputReleaseOrderID.value;
    let releaseIDUpdate= inputReleaseID.value
    let orderIDUpdate = inputOrderID.value
    let purchasePriceUpdate = inputPurchasePrice.value

  
    // currently the database table does not allow updating values to NULL
    // so we must abort if NULL

    if ((!releaseorderIDUpdate)) 
    {
        return;
    }

    if ((!releaseIDUpdate)) 
    {
        return;
    }

    if ((!orderIDUpdate)) 
    {
        return;
    }

    if ((!purchasePriceUpdate)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        releaseorderID: releaseorderIDUpdate,
        releaseID: releaseIDUpdate,
        orderID: orderIDUpdate,
        purchasePrice: purchasePriceUpdate,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-release-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            console.log("response!", xhttp.response)
            // Add the new data to the table
            updateRow(xhttp.response, releaseorderIDUpdate);
            console.log(xhttp.response);
            getReleaseData();
            getOrderData();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, releaseorderID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("release-order-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == releaseorderID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let releaseorderID_row = updateRowIndex.getElementsByTagName("td")[0];
            let releaseID_row = updateRowIndex.getElementsByTagName("td")[1]
            let orderID_row = updateRowIndex.getElementsByTagName("td")[2]
            let purchasePrice_row = updateRowIndex.getElementsByTagName("td")[3]

            // Reassign to our value we updated to
            console.log("parsed data", parsedData[0]);
            releaseorderID_row.innerHTML = parsedData[0].releaseorderID; 
            releaseID_row.innerHTML = parsedData[0].releaseID; 
            orderID_row.innerHTML = parsedData[0].orderID; 
            purchasePrice_row.innerHTML = parsedData[0].purchasePrice; 

       }
    }
}


async function getReleaseData() {
    console.log("updating the releases select")
    const response = await fetch("/releases-json");
    const data = await response.json();
    console.log("here's data", data.data);

    const selectRe = document.getElementById("mySelectReleaseOrderUpdateRelease");
    selectRe.innerHTML = "";

    const releaseArray = data.data;
    for (let index = 0; index<releaseArray.length; index++){
        let releaseOption = document.createElement("option");
        let release = releaseArray[index];

        releaseOption.value = release.releaseID;
        releaseOption.text = release.releaseID;
        selectRe.appendChild(releaseOption);
        
    }
}


async function getOrderData() {
    console.log("updating the orders select")
    const response = await fetch("/orders-json");
    const data = await response.json();
    console.log("here's data", data.data);

    const selectRe = document.getElementById("mySelectReleaseOrderUpdateOrder");
    selectRe.innerHTML = "";

    const orderArray = data.data;
    for (let index = 0; index<orderArray.length; index++){
        let orderOption = document.createElement("option");
        let order = orderArray[index];

        orderOption.value = order.orderID;
        orderOption.text = order.orderID;
        selectRe.appendChild(orderOption);
        
    }
}