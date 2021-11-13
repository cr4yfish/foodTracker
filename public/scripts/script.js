//const _URL = "http://localhost:30001";
const _URL = "http://192.168.0.100:30001";

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
    let url = `${_URL}/updateProgram`;

    const reqOptions = {
        method : "POST",
    }

    fetch(url, reqOptions);
    await sleep(7000);
    window.location.replace(_URL);
    
}

getItems();
addListeners();


const children = document.getElementById("tablecontent").childNodes

children.forEach(function(row) {
    return row.querySelector("th").textContent;
})