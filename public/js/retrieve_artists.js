// original file to populate FK dropdown on Artist page

async function getData() {
    const response = await fetch("/artistNames");
    const data = await response.json();
    console.log("here's data", data.data);

    const selectAdd = document.getElementById("mySelectAdd");

    const artistArray = data.data;
    for (let index = 0; index<artistArray.length; index++){
        let artistOption = document.createElement("option");
        let artist = artistArray[index];

        artistOption.value = artist.artistID;
        artistOption.text = artist.artistName;
        selectAdd.appendChild(artistOption);
        
    }


}

getData();