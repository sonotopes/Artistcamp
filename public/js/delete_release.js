
function deleteRelease(releaseID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: releaseID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-release-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(releaseID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(releaseID){

    let table = document.getElementById("release-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == releaseID) {
            table.deleteRow(i);
            deleteDropDownMenu(releaseID);
            break;
       }
    }
}

function deleteDropDownMenu(releaseID){
  let selectMenu = document.getElementById("mySelectRelease");
  for (let i = 0; i < selectMenu.length; i++){
    console.log("releaseID check", releaseID);
    console.log("release update dropdown check", selectMenu.options[i].value);
    if (Number(selectMenu.options[i].value) === Number(releaseID)){
      selectMenu[i].remove();
      break;
    } 

  }
}