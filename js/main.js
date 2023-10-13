feather.replace()

// getting themeToggler button
const themeToggler = document.querySelector("button.theme__toggler")

const changeTheme = theme => {
    if (theme === "dark") document.body.classList.add("dark-theme")
    else document.body.classList.remove("dark-theme")
}

const toggleTheme = () => {
    if (document.body.classList.contains("dark-theme")) {
        changeTheme("light")
        localStorage.setItem("theme", "light")
    } else {
        changeTheme("dark")
        localStorage.setItem("theme", "dark")
    }
}

const setTheme = () => {
    let usersTheme = localStorage.getItem("theme")

    if (!usersTheme) {
        changeTheme(
            window.matchMedia("(prefers-color-scheme: dark)").matches ?
            "dark" : "light"
        )
    } else {
        changeTheme(usersTheme)
    }
}

// setting the initial theme
setTheme()

if (themeToggler)
    themeToggler.addEventListener("click", toggleTheme)


// GRID CODE
// ==========================
const DEFAULT_GRID_SIZE = 16

// Getting all necessary elements from the DOM
const canvas = document.querySelector("#canvas")
const gridSizeInput = document.querySelector("#grid_size")
const gridSizeLabel = document.querySelector("label[for='grid_size']")
const gridSizeForm = document.querySelector("div.canvas__grid")
const gridSizeIncrementor = document.querySelector("button#grid_size_inc")
const gridSizeDecrementor = document.querySelector("button#grid_size_dec")
const gridLinesToggler = document.querySelector("#grid-lines")

const createGridElement = width => {
    let gridItem = document.createElement("div")
    gridItem.style.width = width + "%"
    return gridItem
}

const generateGrids = size => {
    // before generating any grid empty the canvas first
    canvas.innerHTML = ""

    let maxWidth = 100 / size

    for (itr = 1; itr <= size ** 2; itr++) {
        gridItem = createGridElement(maxWidth)
        canvas.appendChild(gridItem)
    }
}

const updateDOM = gridSize => {
    gridSizeInput.value = gridSize
    gridSizeLabel.textContent = "X " + gridSize
    generateGrids(gridSize)
}

const setInitialGridSize = () => {
    let gridSize = localStorage.getItem("gridSize") || DEFAULT_GRID_SIZE
    updateDOM(gridSize)
}

const validateGridSizeInput = value => {
    if (isNaN(value)) return false
    else if (2 > value || value > 70) return false
    return true
}

const showErrorMessage = (parent, message) => {
    let errorMessage = parent.querySelector(".error")
    
    if (!errorMessage) {
        errorMessage = document.createElement("p")
        errorMessage.classList.add("error")
        parent.appendChild(errorMessage)
    }

    errorMessage.textContent = message
}

const removeErrorMessage = parent => {
    let errorMessage = parent.querySelector(".error")

    if (errorMessage)
        parent.removeChild(errorMessage)
}

gridSizeInput.addEventListener("keyup", () => {
    let value = Number(gridSizeInput.value)

    if (!validateGridSizeInput(value)) {
        showErrorMessage(
            gridSizeForm,
            "Grid size must be a number between 2 and 70, inclusively."
        )
    } else {
        updateDOM(value)
        removeErrorMessage(gridSizeForm)
    }
})

gridSizeIncrementor.addEventListener("click", () => {
    let value = Number(gridSizeInput.value)

    if (!validateGridSizeInput(value)) {
        showErrorMessage(
            gridSizeForm,
            "Whether the value isn't a number or out of the range 2 and 70."
        )
    } else if (value != 70) {
        updateDOM(value + 1)
        removeErrorMessage(gridSizeForm)
        
        // disable the button from consecutive multiple clicks
        gridSizeIncrementor.setAttribute("disabled", true)
        setTimeout(() => {
            gridSizeIncrementor.removeAttribute("disabled")
        }, 300);
    }
})

gridSizeDecrementor.addEventListener("click", () => {
    let value = Number(gridSizeInput.value)

    if (!validateGridSizeInput(value)) {
        showErrorMessage(
            gridSizeForm,
            "Whether the value isn't a number or out of the range 2 and 70."
        )
    } else if (value != 2) {
        updateDOM(value - 1)
        removeErrorMessage(gridSizeForm)

        // disable the button from consecutive multiple clicks
        gridSizeDecrementor.setAttribute("disabled", true)
        setTimeout(() => {
            gridSizeDecrementor.removeAttribute("disabled")
        }, 300);
    }
})

const setInitialGridLines = () => {
    if (localStorage.getItem("gridLines"))
        canvas.classList.add("canvas--grid-lines")
}

gridLinesToggler.addEventListener("change", () => {
    if (gridLinesToggler.checked) {
        canvas.classList.add("canvas--grid-lines")
        localStorage.setItem("gridLines", true)
    } else {
        canvas.classList.remove("canvas--grid-lines")
        localStorage.removeItem("gridLines")
    }
})

// initializing the grids
setInitialGridSize()
setInitialGridLines()


// let radioButtons = document.querySelectorAll("input[type='radio']")
// console.log(radioButtons)
// radioButtons.forEach(radioButton => {
//     radioButton.addEventListener("change", () => {
//         console.log(radioButton.checked)
//     }) 
// });