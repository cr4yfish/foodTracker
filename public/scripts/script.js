const _URL = "http://localhost:30000";

// sort popup handling
const sortSelect = document.getElementById("inputSort");

sortSelect.addEventListener("change", function(e) {
    getItems();
})

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
        console.log(response);
        drawItemGroups(response);
    })
}

function sendItem() {

    const object = {
        name: document.getElementById("inputName").value,
        count: document.getElementById("inputCount").value,
        date: document.getElementById("inputDate").valueAsNumber,
    }

    let obName = object.name.toLowerCase();

    if(
        object.name.length < 2 || 
        object.count < 0 || 
        object.date == null ||
        obName.contains("ei") ||
        obName.contains("fleisch") ||
        obName.contains("huhn") ||
        obName.contains("rind") ||
        obName.contains("milch")
        ) {
        // not valid information
        console.log("Invalid info");
        alert("Try again!");
    } 
    else 
    {
        console.log(object);

        let url = `${_URL}/api/sendItem`;
    
           const requestOptions = {
            method: "POST",
            body: JSON.stringify(object),
            headers: {
                "Content-Type": "application/json"
            },
            }
    
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(function(response) {
            console.log(response);
            getItems()
            togglePopup();
        })
    }
}

function clearItemGroups() {
    return new Promise((resolve, reject) => {
        let groups = document.getElementById("itemWrapper").children;
    
        console.log(groups);

        for(let i = groups.length-1; i >= 0; i--) {
            groups[i].remove();
        }
        resolve();
    })
}

function drawItemGroups(items) {

    clearItemGroups().then(function() {
        const parent = document.getElementById("itemWrapper");

        items.forEach(function(item) {
    
            const itemGroup = document.createElement("div");
                itemGroup.classList.add("itemGroup");
            parent.appendChild(itemGroup);
    
            const itemName = document.createElement("span");
                itemName.classList.add("itemName");
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
        })
    })
}

function togglePopup() {
    const popup = document.getElementById("popup");

    if (popup.dataset.active == "true") {
        popup.style.display = "none";
        popup.dataset.active = "false";
    } else {
        popup.style.display = "block";
        popup.dataset.active = "true";
    }
}

getItems();