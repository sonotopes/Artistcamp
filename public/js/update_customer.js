
// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("mySelect");
    let inputEmail = document.getElementById("input-email-update");
    let inputPassword = document.getElementById("input-password-update");

    // Get the values from the form fields
    let customerIDUpdate= inputCustomerID.value;
    let emailUpdate = inputEmail.value;
    let passwordUpdate = inputPassword.value;
 
    // currently the database table does not allow updating values to NULL
    // so we must abort if NULL

    if ((!emailUpdate)) 
    {
        return;
    }

    if ((!passwordUpdate)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerIDUpdate,
        email: emailUpdate,
        password: passwordUpdate,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, customerIDUpdate);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, customerID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customerID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let password_row = updateRowIndex.getElementsByTagName("td")[3];
            let email_row = updateRowIndex.getElementsByTagName("td")[2]

            // Reassign to our value we updated to
            password_row.innerHTML = parsedData[0].password; 
            email_row.innerHTML = parsedData[0].email; 
       }
    }
}
