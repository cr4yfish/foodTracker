function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentSearch() {
    let returnVal;

    if(document.getElementById("searchbar").value.length < 3) {
        returnVal = "none";
    } else {
        returnVal = document.getElementById("searchbar").value;
    }
    return returnVal;
}

function getCurrentSort() {
    const selectEle = document.getElementById("inputSort");
    return selectEle[selectEle.selectedIndex].value;
}

async function toggleSidebar(state) {
    let sidebar = document.getElementById("sidebar");
    if(state == "close") {
        toggleOpacityLayer("close");
        sidebar.style.width = "0";
        await sleep(1000);
        sidebar.style.display = "none";
    } else if (state == "open") {
        toggleOpacityLayer("open");
        sidebar.style.display = "block";
        await sleep(50);
        sidebar.style.width = "15rem";
        document.getElementById("opacityLayer").setAttribute("onclick", "toggleSidebar('close')")
    }
}

async function toggleOpacityLayer(state) {
    let opacityLayer = document.getElementById("opacityLayer");
    if( state == "close") {
        opacityLayer.style.opacity = "0.0";
        await sleep(1000);
        opacityLayer.style.display = "none";
    } else if( state == "open") {
        opacityLayer.style.display = "block";
        await sleep(100);
        opacityLayer.style.opacity = "1.0";
    }
}

function togglePopup() {

    // make visible
    const popup = document.getElementById("popup");

    if (popup.dataset.active == "true") {
        popup.style.display = "none";
        popup.dataset.active = "false";
        toggleOpacityLayer("close");
    } else {
        popup.style.display = "block";
        popup.dataset.active = "true";
        toggleOpacityLayer("open");
        document.getElementById("opacityLayer").setAttribute("onclick", "togglePopup('close')")
    }
}


function displayItem(item) {

    let date = new Date(item.querySelector(".itemDate").textContent);

        // Set the date
    date = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + 
    '-' + date.getDate().toString().padStart(2, 0);

    let object = {
        name: item.querySelector(".itemName").textContent,
        count: item.querySelector(".itemCount").textContent,
        date: date,
        id: item.querySelector(".itemName").dataset.id,
    }


    document.getElementById("inputName").dataset.id = object.id;
    document.getElementById("inputName").value = object.name;
    document.getElementById("inputCount").value = object.count;
    document.getElementById("inputDate").value = date;
    document.getElementById("inputGroup").value = object.value;


    // set labels
    let inputFields = document.querySelectorAll("input");

    inputFields.forEach(input => {
        try {

            if(input.previousElementSibling.classList.contains("linkRemove") == false) { 
                input.previousElementSibling.style.transform = "translateY(-1.75em)"
            }
            
        }
        catch {
            console.log(`${input} is not correct`)
        }
    })

    document.getElementById("confirmBtn").textContent = "Update";
    document.getElementById("popupTitleText").textContent = "Edit item";
    document.getElementById("confirmBtn").setAttribute("onclick", "sendItem('update')");

    // show remove btn
    document.getElementById("removeBtn").style.display = "block";


    togglePopup();
}


function clearPopup() {

    // deactivate labels and clear inputs
    let inputFields = document.querySelectorAll("input");

    inputFields.forEach(input => {
     
        if(input.value != "") {
            input.value = "";
            input.previousElementSibling.style.transform = "translateY(0) translateX(0.5em)";
        }
        
    })

    // hide removeBtn
    document.getElementById("removeBtn").style.display = "none";

    document.getElementById("confirmBtn").textContent = "Add";
    document.getElementById("confirmBtn").setAttribute("onclick", "sendItem('add')");

    document.getElementById("popupTitleText").textContent = "Add item";

}


function clearItemGroups() {
    return new Promise((resolve, reject) => {
        let groups = document.getElementById("itemWrapper").children;
    

        for(let i = groups.length-1; i >= 0; i--) {
            groups[i].remove();
        }
        resolve();
    })
}
