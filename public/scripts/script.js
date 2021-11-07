const _URL = "http://localhost:30001";
//const _URL = "http://192.168.0.100:30001";

function addListeners() {

    // sort popup handling
    const sortSelect = document.getElementById("inputSort");

    sortSelect.addEventListener("change", function(e) {
        getItems();
    })
}

function toggleSidebar(state) {
    let sidebar = document.getElementById("sidebar");
    if(state == "close") {
        sidebar.style.width = "0";
        toggleOpacityLayer("close");
    } else if (state == "open") {
        sidebar.style.width = "15rem";
        toggleOpacityLayer("open");
        document.getElementById("opacityLayer").setAttribute("onclick", "toggleSidebar('close')")
    }
}

function toggleOpacityLayer(state) {
    let opacityLayer = document.getElementById("opacityLayer");
    if( state == "close") {
        opacityLayer.style.display = "none";
    } else if( state == "open") {
        opacityLayer.style.display = "block";
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


function getCurrentSort() {
    const selectEle = document.getElementById("inputSort");
    return selectEle[selectEle.selectedIndex].value;
}

// get Items
function getItems() {
    let url = `${_URL}/api/getItems/${getCurrentSort()}`;

    fetch(url)
    .then(response => response.json())
    .then(function(response) {
        drawItemGroups(response);

    })
}

function sendItem(updateOrAdd) {

    let object = {
        name: document.getElementById("inputName").value,
        count: document.getElementById("inputCount").value,
        date: document.getElementById("inputDate").valueAsNumber,
        group: document.getElementById("inputGroup").value,
    }

    if (
        object.name.length < 2 || 
        object.count < 0 || 
        object.date == null
        ) {
        // not valid information
        console.log("Invalid info");
        alert("Try again!");
    } 
    else 
    {

        if(updateOrAdd == "update") {
            object.id = document.getElementById("inputName").dataset.id
            
        }

        console.log("Sending this: ", object);

        let url = `${_URL}/api/sendItem/${updateOrAdd}`;
    
           const requestOptions = {
            method: "POST",
            body: JSON.stringify(object),
            headers: {
                "Content-Type": "application/json"
            },
            }

        fetch(url, requestOptions)
        .then(function() {
            getItems()
            togglePopup();
        })
    }
}

function removeItem(id) {
    console.log("Removing this: ", id);

    const object = {
        id: id,
    }

    let url = `${_URL}/api/removeItem`;

        const requestOptions = {
        method: "DELETE",
        body: JSON.stringify(object),
        headers: {
            "Content-Type": "application/json"
        },
        }

    fetch(url, requestOptions)
    .then(function() {
        getItems()
        togglePopup();
    })
    
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

function drawItemGroups(items) {

    clearItemGroups().then(function() {
        let parent = document.getElementById("itemWrapper");

        items.forEach(function(item) {

            // add fieldset if item has group and change parent to the fieldset
            if(document.getElementById(item.group) == null && item.hasOwnProperty("group")) {
                const itemFieldset = document.createElement("fieldset");
                    itemFieldset.setAttribute("class", "itemFieldset");
                    itemFieldset.setAttribute("id", item.group);
                document.querySelector("#itemWrapper").appendChild(itemFieldset);

                const legend = document.createElement("legend");
                    legend.textContent = item.group;
                itemFieldset.appendChild(legend);

                parent = itemFieldset;
            } else if (item.hasOwnProperty("group")) {
                // item has group and fieldset already exists

                parent = document.getElementById(item.group);
            }

            const itemGroup = document.createElement("div");
                itemGroup.classList.add("itemGroup");
                itemGroup.setAttribute("onclick", "displayItem(this)");
            parent.appendChild(itemGroup);
    
            const itemName = document.createElement("span");
                itemName.classList.add("itemName");
                itemName.dataset.id = item._id;
                itemName.textContent = item.name;
            itemGroup.appendChild(itemName);
    
            const itemCount = document.createElement("span");
                itemCount.classList.add("itemCount");
                itemCount.textContent = item.count;
            itemGroup.appendChild(itemCount);
    
            let date = new Date(item.date);
            const itemDate = document.createElement("span");
                itemDate.classList.add("itemDate");
                itemDate.textContent = date.toDateString();
            itemGroup.appendChild(itemDate);

            document.getElementById("removeBtn").dataset.id = item._id;

            // reset parent for next element
            parent = document.getElementById("itemWrapper");
        })

        addListeners();
    })
}


function clearPopup() {

    // deactivate labels and clear inputs
    let inputFields = document.querySelectorAll("input");

    inputFields.forEach(input => {
        try {
            if(input.value != "") {
                input.value = "";
                input.previousElementSibling.style.transform = "translateY(0) translateX(0.5em)";
            }
        }
        catch {
            
        }
    })

    // hide removeBtn
    document.getElementById("removeBtn").style.display = "none";

    document.getElementById("confirmBtn").textContent = "Add";
    document.getElementById("confirmBtn").setAttribute("onclick", "sendItem('add')");

    document.getElementById("popupTitleText").textContent = "Add item";

}

getItems();