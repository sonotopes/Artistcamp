
// Get the objects we need to modify
let updateArtistForm = document.getElementById('update-artist-form-ajax');

// Modify the objects we need
updateArtistForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputArtistID = document.getElementById("mySelect");
    let inputGenre = document.getElementById("input-genre-update");
    let inputLocation = document.getElementById("input-location-update");


    // Get the values from the form fields
    let artistIDUpdate= inputArtistID.value;
    let genreUpdate = inputGenre.value;
    let locationUpdate = inputLocation.value;

   
    // currently the database table does not allow updating values to NULL
    // so we must abort if NULL

    if ((!genreUpdate)) 
    {
        return;
    }

    if ((!locationUpdate)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        artistID: artistIDUpdate,
        genre: genreUpdate,
        location: locationUpdate
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-artist-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, artistIDUpdate);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, artistID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("artist-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == artistID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let location_row = updateRowIndex.getElementsByTagName("td")[3];
            let genre_row = updateRowIndex.getElementsByTagName("td")[2]

            // Reassign to our value we updated to
            location_row.innerHTML = parsedData[0].location; 
            genre_row.innerHTML = parsedData[0].genre; 
       }
    }
}
