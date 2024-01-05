// Get the objects we need to modify
let addTrackForm = document.getElementById('add-track-form-ajax');


// Modify the objects we need
addTrackForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRelease = document.getElementById("mySelectRelease");
    let inputTitle = document.getElementById("input-trackTitle");

    // Get the values from the form fields
    let releaseValue = inputRelease.value;
    let titleValue = inputTitle.value;

    // Put our data we want to send in a javascript object
    let data = {
        releaseID: releaseValue,
        title: titleValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/add-track-ajax', true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRelease = null;
            inputTitle = "";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from entity. 
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("track-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let releaseIDCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");
    // Fill the cells with correct data
    idCell.innerText = newRow.trackID;
    titleCell.innerText = newRow.title;
    releaseIDCell.innerText = newRow.releaseID;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTrack(newRow.trackID);
    };
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(releaseIDCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.trackID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelectTrackUpdateTrack");
    let option = document.createElement("option");
    option.text = newRow.title;
    option.value = newRow.trackID;
    selectMenu.add(option);
}