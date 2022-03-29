const APIURL = "https://to-do-homelist.herokuapp.com/products"

const theContainer = document.querySelector(".item-container");
const theInput = document.querySelector(".add-input");
const theButton = document.querySelector(".add-button");

const sendToApi = async (event) => {
    event.preventDefault();
    const theItem = theInput.value.trim();
    const data = JSON.stringify({ title: theItem, featured: false })
    const options = {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
        }
    }
    try {
        const response = await fetch(APIURL, options)
    }
    catch(error) {
        console.log(error)
    }
    theInput.value = ""
    buildItems();
}

theButton.addEventListener("click", sendToApi)

const itemChecked = async (event) => {
    const id = event.target.dataset.id;

    const items = document.querySelectorAll(`.item${id}`)

    items.forEach(item => {
        item.classList.toggle("completed")
    })
    const updateIt = async (isIt) => {
        const id = event.target.dataset.id
        const data = JSON.stringify({featured: isIt})
        const optionsPut = {
            method: "PUT",
            body: data,
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const theResponse = await fetch(APIURL + `/${id}`, optionsPut)
            const theResult = await theResponse.json()
        }
        catch(error) {
            console.log(error)
        }
    }

    const optionsGet = {
        method: "GET",
        "Content-Type": "application/json",
    }
    try {
        const response = await fetch(APIURL + `/${id}`, optionsGet);
        const result = await response.json();
        if(!result.featured) {
            updateIt(true);
        }
        else {
            updateIt(false)
        }
    }
    catch(error) {
        console.log(error)
    }


}

const buildItems = async () => {
    const options = {
        method: "GET",
        "Content-Type": "application/json",
    }
    try {
        const response = await fetch(APIURL, options)
        const dataItems = await response.json()
        if(dataItems.length > 0) {
            theContainer.innerHTML = "";
            dataItems.forEach((item) => {
                let isCompleted = "";
                if(item.featured) {
                    isCompleted = "completed"
                }
                theContainer.innerHTML += `<div class="item item${item.id} ${isCompleted}" >
                                                <h2 class="item-title">${item.title}</h2>
                                                <div class="item-complete item${item.id} ${isCompleted}"  data-id="${item.id}"><i class="fa-solid fa-check" data-id="${item.id}"></i></div>
                                                <div class="item-remove" data-id="${item.id}"><i class="fa-solid fa-xmark" data-id="${item.id}"></i></div>
                                            </div>`
            })

            const completeButtons = document.querySelectorAll(".item-complete");
            const removeButtons = document.querySelectorAll(".item-remove");

            completeButtons.forEach(item => {
                item.addEventListener("click", itemChecked)
            })

            removeButtons.forEach(item => {
                item.addEventListener("click", removeItem)
            })
        }
        else {
            theContainer.innerHTML = `<div class="nothing-here">ITS NOTHING HERE!</div>`
        }
    }
    catch(error) {
        console.log(error)
    }
}

const thePrompt = document.querySelector(".prompt")
const accept = document.querySelector(".accept-button")
const cancle = document.querySelector(".cancle-button")




const canclePrompt = () => {
    thePrompt.style.display = "none";
}

const removeItem = async (event) => {

    const id = event.target.dataset.id;
    const options = {
        method: "DELETE",
    }

    thePrompt.style.display = "block"

    const deleteItem = async () => {
        try {
            const response = await fetch(APIURL + `/${id}`, options)
        }
        catch(error) {
            console.log(error)
        }
        thePrompt.style.display = "none";
        buildItems();
    }
    accept.addEventListener("click", deleteItem)
}


cancle.addEventListener("click", canclePrompt)

buildItems();