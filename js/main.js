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


// GRID ITEMS GENERATING CODE
// ==========================
const DEFAULT_GRID_SIZE = 16

// Getting all necessary elements from the DOM
const canvas = document.querySelector("#canvas")
const gridSizeInput = document.querySelector("#grid_size")
const gridSizeLabel = document.querySelector("label[for='grid_size']")

const createGridElement = width => {
    let gridItem = document.createElement("div")
    gridItem.style.width = width + "%"
    return gridItem
}

const generateGrids = size => {
    let maxWidth = 100 / size

    for (itr = 1; itr <= size ** 2; itr++) {
        gridItem = createGridElement(maxWidth)
        canvas.appendChild(gridItem)
    }
}

const setInitialGridSize = () => {
    let gridSize = localStorage.getItem("gridSize") || DEFAULT_GRID_SIZE
    
    gridSizeInput.value = gridSize
    gridSizeLabel.textContent = "X " + gridSize
    generateGrids(gridSize)
}

// gridSizeInput.addEventListener("keyup", () => {
//     console.log("the value has been updated")
// })

setInitialGridSize()