
// Get the objects we need to modify
let updateReleaseForm = document.getElementById('update-release-form-ajax');

// Modify the objects we need
updateReleaseForm.addEventListener("submit", function (e) {
    console.log("updating start")
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputReleaseID = document.getElementById("mySelectRelease");
    let inputTitle = document.getElementById("input-title-update");
    let inputDescription = document.getElementById("input-description-update");
    let inputDate = document.getElementById("input-date-update");
    let inputImage = document.getElementById("input-image-update");
    let inputPrice = document.getElementById("input-price-update");

    // Get the values from the form fields
    let releaseIDUpdate= inputReleaseID.value;
    let titleUpdate = inputTitle.value;
    let descriptionUpdate = inputDescription.value;
    let dateUpdate = inputDate.value;
    let imageUpdate = inputImage.value;
    let priceUpdate = inputPrice.value;
   
    // currently the database table does not allow updating values to NULL
    // so we must abort if NULL

    if ((!titleUpdate)) 
    {
        return;
    }

    if ((!descriptionUpdate)) 
    {
        return;
    }

    if ((!dateUpdate)) 
    {
        return;
    }

    if ((!imageUpdate)) 
    {
        return;
    }

    if ((!priceUpdate)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        releaseID: releaseIDUpdate,
        title: titleUpdate,
        description: descriptionUpdate,
        releaseDate: dateUpdate,
        imageURL: imageUpdate,
        price: priceUpdate
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-release-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            console.log("response!", xhttp.response)
            // Add the new data to the table
            updateRow(xhttp.response, releaseIDUpdate);
            console.log(xhttp.response);
            getReleaseData();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, releaseID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("release-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == releaseID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let title_row = updateRowIndex.getElementsByTagName("td")[1];
            let date_row = updateRowIndex.getElementsByTagName("td")[3]
            let image_row = updateRowIndex.getElementsByTagName("td")[2]
            let image = document.createElement("img");
            let description_row = updateRowIndex.getElementsByTagName("td")[6]
            let price_row = updateRowIndex.getElementsByTagName("td")[4]

            // Reassign to our value we updated to
            title_row.innerHTML = parsedData[0].title; 
            date_row.innerHTML = parsedData[0].releaseDate; 
            image.src = parsedData[0].imageURL; 
            image.alt = parsedData[0].title; 
            image_row.innerHTML = "";
            image_row.appendChild(image);
            description_row.innerHTML = parsedData[0].description; 
            price_row.innerHTML = parsedData[0].price; 
            console.log(title_row, date_row, image_row, description_row);
       }
    }
}


async function getReleaseData() {
    console.log("updating the releases select")
    const response = await fetch("/releases-json");
    const data = await response.json();
    console.log("here's data", data.data);

    const selectRe = document.getElementById("mySelectRelease");
    selectRe.innerHTML = "";

    const releaseArray = data.data;
    for (let index = 0; index<releaseArray.length; index++){
        let releaseOption = document.createElement("option");
        let release = releaseArray[index];

        releaseOption.value = release.releaseID;
        releaseOption.text = release.title;
        selectRe.appendChild(releaseOption);
        
    }
}