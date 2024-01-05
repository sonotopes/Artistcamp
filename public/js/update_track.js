
// Get the objects we need to modify
let updateTrackForm = document.getElementById('update-track-form-ajax');

// Modify the objects we need
updateTrackForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputReleaseID = document.getElementById("mySelectTrackUpdateRelease");
    let inputTrackID = document.getElementById("mySelectTrackUpdateTrack");
    let inputTitle = document.getElementById("input-title-update");


    // Get the values from the form fields
    let trackID= inputTrackID.value;
    let titleUpdate = inputTitle.value;
    let releaseUpdate = inputReleaseID.value;

   
    // currently the database table does not allow updating values to NULL
    // so we must abort if NULL

    if ((!trackID)) 
    {
        return;
    }

    if ((!titleUpdate)) 
    {
        return;
    }

    if ((!releaseUpdate)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        trackID: trackID,
        title: titleUpdate,
        releaseID: releaseUpdate
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-track-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, trackID);
            console.log("update made, updating select...")
            getTrackData()

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, trackID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("track-table");

    console.log("parsedData check", parsedData);

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == trackID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let title_row = updateRowIndex.getElementsByTagName("td")[1];
            let releaseID_row = updateRowIndex.getElementsByTagName("td")[2]

            // Reassign to our value we updated to
            title_row.innerHTML = parsedData[0].title; 
            releaseID_row.innerHTML = parsedData[0].releaseID; 
       }
    }
}

// GET & UPDATE TRACK SELECT DROPDOWN
async function getTrackData() {
    console.log("updating the tracks select")
    const response = await fetch("/tracks-json");
    const data = await response.json();
    console.log("here's data", data.data);

    const selectRe = document.getElementById("mySelectTrackUpdateTrack");
    selectRe.innerHTML = "";

    const releaseArray = data.data;
    for (let index = 0; index<releaseArray.length; index++){
        let releaseOption = document.createElement("option");
        let release = releaseArray[index];

        releaseOption.value = release.trackID;
        releaseOption.text = release.title;
        selectRe.appendChild(releaseOption);
        
    }
}