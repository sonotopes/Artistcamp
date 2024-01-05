// original file to populate FK dropdown on Track page

async function getReleaseData() {
    const response = await fetch("/releases-json");
    const data = await response.json();
    console.log("here's data", data.data);

    const selectRe = document.getElementById("mySelectRelease");

    const releaseArray = data.data;
    for (let index = 0; index<releaseArray.length; index++){
        let releaseOption = document.createElement("option");
        let release = releaseArray[index];

        releaseOption.value = release.releaseID;
        releaseOption.text = release.title;
        selectRe.appendChild(releaseOption);
        
    }

    const trackReleasesSelect = document.getElementById("mySelectTrackUpdateRelease");

    if (trackReleasesSelect !== null){
        for (let index = 0; index<releaseArray.length; index++){
            let releaseOption = document.createElement("option");
            let release = releaseArray[index];
    
            releaseOption.value = release.releaseID;
            releaseOption.text = release.title;
            trackReleasesSelect.appendChild(releaseOption);
            
        }
    }
}

getReleaseData();