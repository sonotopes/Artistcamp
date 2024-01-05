
function deleteOrder(orderID) {
    console.log("order is deleting???", orderID)
    // Put our data we want to send in a javascript object
    let data = {
        id: orderID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(orderID);
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(orderID){

    let table = document.getElementById("order-table");
    console.log("table check", table);
    console.log("deleting the row...")
    for (let i = 0, row; row = table.rows[i]; i++) {
      console.log(table.rows[i], "row check?")
      console.log("order id check", orderID)
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (Number(table.rows[i].getAttribute("data-value")) === orderID) {
            console.log('table row', table.rows[i])
            table.deleteRow(i);
            deleteDropDownMenu(orderID);
            break;
       }
    }
}

function deleteDropDownMenu(orderID){
  console.log("deleting from drop down menu for orders")
  let selectMenu = document.getElementById("mySelectOrderUpdateOrder");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(orderID)){
      selectMenu[i].remove();
      break;
    } 

  }
}