// get Items
function getItems() {
    let url = `${_URL}/api/getItems/${getCurrentSort()}/${getCurrentSearch()}`;

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