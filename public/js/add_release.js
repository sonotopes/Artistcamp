// Get the objects we need to modify
let addReleaseForm = document.getElementById('add-release-form-ajax');


// Modify the objects we need
addReleaseForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputArtistID = document.getElementById("mySelectAdd");
    let inputTitle = document.getElementById("input-releaseTitle");
    let inputReleaseDate = document.getElementById("input-date");
    let inputImageURL = document.getElementById("input-imageURL");
    let inputDescription = document.getElementById("input-description");
    let inputPrice = document.getElementById("input-price");

    // Get the values from the form fields
    let artistNameValue = inputArtistID.value;
    let titleValue = inputTitle.value;
    let releaseDateValue = inputReleaseDate.value;
    let formattedDate = releaseDateValue.toLocaleString("default", {year: "numeric"})
    let imageURLValue = inputImageURL.value;
    let descriptionValue = inputDescription.value;
    let priceValue = inputPrice.value;
    console.log("price value", priceValue);
    console.log("date", formattedDate)
    // Put our data we want to send in a javascript object
    let data = {
        artistID: artistNameValue,
        title: titleValue,
        releaseDate: formattedDate,
        imageURL: imageURLValue, 
        description: descriptionValue,
        price: priceValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/add-release-ajax', true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTitle = '';
            inputReleaseDate = null;
            inputDescription = '';
            inputImageURL ='';
            inputPrice = 0;
            artistID = null;
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from entity
addRowToTable = (data) => {
    console.log("data for new row DOM", data)

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("release-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let releaseDateCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let imageURLCell = document.createElement("TD");
    let img = document.createElement("img");
    let artistIDCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");
    // Fill the cells with correct data
    idCell.innerText = newRow.releaseID;
    artistIDCell.innerText = newRow.artistID;
    titleCell.innerText = newRow.title;
    releaseDateCell.innerText = newRow.releaseDate;
    priceCell.innerText = newRow.price;
    img.src = newRow.imageURL;
    img.alt = newRow.imageURL;
    imageURLCell.appendChild(img);
    descriptionCell.innerText = newRow.description;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteRelease(newRow.releaseID);
    };
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(imageURLCell);
    row.appendChild(releaseDateCell);
    row.appendChild(priceCell);
    row.appendChild(artistIDCell);
    row.appendChild(descriptionCell);
     row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.releaseID);
    
    // Add the row to the table
    currentTable.appendChild(row);
    let selectMenu = document.getElementById("mySelectRelease");
    let option = document.createElement("option");
    option.text = newRow.title;
    option.value = newRow.releaseID;
    selectMenu.add(option);
}