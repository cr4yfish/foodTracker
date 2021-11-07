
let inputFields = document.querySelectorAll("input");

inputFields.forEach(input => {
    try {
        input.addEventListener("focus", function(e) {
            try {
                if(e.target.previousElementSibling.classList.contains("linkRemove") == false) { 
                    e.target.previousElementSibling.style.transform = "translateY(-1.55em)"
                }
            }
            catch (e) {
                
            }
        })
    }
    catch {
        console.log(`${e.target} is not correct`)
    }
})

inputFields.forEach(input => {
    input.addEventListener("blur", function(e) {
        try {
            if(e.target.value == "") {
                e.target.previousElementSibling.style.transform = "translateY(0) translateX(0.5em)"
            }
        }
        catch {
            
        }
    })
})
