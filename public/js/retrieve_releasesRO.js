// original file to populate FK dropdown

async function getReleaseDataRO() {
    const response = await fetch("/releases-json");
    const data = await response.json();
    console.log("here's data", data.data);

    const roSelectRelease = document.getElementById("mySelectAddReleaseRO"); 

    releaseArray = data.data

    if (roSelectRelease !== null){
        for (let index = 0; index<releaseArray.length; index++){
            let releaseOption = document.createElement("option");
            let release = releaseArray[index];
    
            releaseOption.value = release.releaseID;
            releaseOption.text = release.releaseID;
            roSelectRelease.appendChild(releaseOption);
            
        }
    }

    const roReleaseSelect = document.getElementById("mySelectReleaseOrderUpdateRelease");

    if (roReleaseSelect !== null){
        for (let index = 0; index<releaseArray.length; index++){
            let releaseOption = document.createElement("option");
            let release = releaseArray[index];
    
            releaseOption.value = release.releaseID;
            releaseOption.text = release.releaseID;
            roReleaseSelect.appendChild(releaseOption);
            
        }
    }
}

getReleaseDataRO();