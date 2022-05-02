

const _URL = "https://localhost:30001";
//const _URL = "http://192.168.0.100:30001";


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
        document.getElementById("qr-reader").style.display = "none";
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
        date = date.toISOString().substring(0, 10);

    let object = {
        name: item.querySelector(".itemName").textContent,
        count: item.querySelector(".itemCount").textContent,
        date: date,
        id: item.querySelector(".itemName").dataset.id,
        group: item.dataset.group,
    }

    console.log(item.querySelector(".itemName").dataset.id);

    document.getElementById("inputName").dataset.id = object.id;
    document.getElementById("inputName").value = object.name;
    document.getElementById("inputCount").value = object.count;
    document.getElementById("inputDate").value = date;
    document.getElementById("inputGroup").value = object.group;


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
    document.getElementById("removeBtn").dataset.id = object.id;


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



function addListeners() {

    // sort popup handling
    const sortSelect = document.getElementById("inputSort");

    sortSelect.addEventListener("change", function(e) {
        getItems();
    })

    // add event listener to search input
    let timeout = null;
    document.getElementById("searchbar").addEventListener("input", function(e) {
        clearTimeout(timeout)
        timeout = setTimeout(function() {
            if(document.getElementById("searchbar").value.length > 2 || document.getElementById("searchbar").value.length == 0) {
                getItems();
            }
        }, 500);

    })
}

async function updateProgram() {
    let url = `/updateProgram`;

    const reqOptions = {
        method : "POST",
    }

    fetch(url, reqOptions);
    await sleep(7000);
    window.location.replace(_URL);
    
}


// get Items
function getItems() {
    let url = `/api/getItems/${getCurrentSort()}/${getCurrentSearch()}`;

    fetch(url)
    .then(response => response.json())
    .then(function(response) {
        drawItemGroups(response);

    })
}

function sendItem(updateOrAdd, reqObject = false) {

    let object = {
        name: document.getElementById("inputName").value,
        count: document.getElementById("inputCount").value,
        date: document.getElementById("inputDate").valueAsNumber,
        group: document.getElementById("inputGroup").value,
    }

    // check if object is set
    if(object != false) {
        object = reqObject;
    }

    if (
        object.name.length < 2 || 
        object.count < 0 || 
        object.date == null
        ) {
        // not valid information
        console.log("Invalid info", object);
        alert("Try again!");
    } 
    else 
    {

        if(updateOrAdd == "update") {
            object.id = document.getElementById("inputName").dataset.id
            
        }

        console.log("Sending this: ", object);

        let url = `/api/sendItem/${updateOrAdd}`;
    
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
            if(updateOrAdd !== "home_scan") {
                togglePopup();
            }
        })
    }
}

function removeItem(id) {
    console.log("Removing this: ", id);

    const object = {
        id: id,
    }

    let url = `/api/removeItem`;

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
                itemGroup.dataset.group = item.group;
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
                itemDate.textContent = date.toLocaleDateString();
            itemGroup.appendChild(itemDate);

            document.getElementById("removeBtn").dataset.id = item._id;

            // reset parent for next element
            parent = document.getElementById("itemWrapper");
        })
    })
}

let _SCANNER_HOME = false;

function toggleScanner(type) {
    if(type === "home") {
        _SCANNER_HOME = true;
    } else {
        _SCANNER_HOME = false;
    }
    const scannerWrapper = document.getElementById("qr-reader");
    document.getElementById("opacityLayer").setAttribute("onclick", "toggleScanner();");
    console.log(scannerWrapper.dataset.state)
    if(scannerWrapper.dataset.state === "closed"){
        scannerWrapper.style.display = "block";
        toggleOpacityLayer("open");
        scannerWrapper.dataset.state = "open";

    } else {
        scannerWrapper.style.display = "none";
        toggleOpacityLayer("close");
        scannerWrapper.dataset.state = "closed";
    }

}


async function onScanSuccess(decodedText, decodedResult) {
    console.log("Code scanned", decodedText, decodedResult);
    document.querySelector("#qr-reader__dashboard_section_csr > span:nth-child(2) > button:nth-child(2)").click();

    // TO-DO: ADD SPINNER OR SOMETHING

    convertUPC(decodedText).then(data => {
        if(_SCANNER_HOME) {
            // add item to home
            const time = new Date().getTime();
            const newItem = {
                name: data.product.attributes.product,
                count: 1,
                date: time,
                group: "none",
            }
            console.log(newItem);
            sendItem("home_scan", newItem)
            toggleOpacityLayer();
        } else {
            document.getElementById("inputName").previousElementSibling.style.transform = "translateY(-1.75em)"
            document.getElementById("inputName").value = data.product.attributes.product;
            document.getElementById("qr-reader").style.display = "none";
        }
    })
    
}

var html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", {
            fps: 30,
            qrbox: 250 
        });

html5QrcodeScanner.render(onScanSuccess);

function convertUPC(upc) {
    return new Promise((resolve, reject) => {

        const url = `/api/convertUPC/${upc}`;
        const options = {
            method: "GET",
            
        }
        fetch(url, options).then(res => res.json()).then(res => {
            console.log(res);
            resolve(res);
        })
    })
}

async function overwriteWidth() {
    // overwrite stupid width
    await sleep(2000);
    document.querySelector("#qr-reader__scan_region > video").style.width = "100%";
}

getItems();
addListeners();
overwriteWidth();