feather.replace()


// GRID CODE
// ==========================
const DEFAULT_GRID_SIZE = 16
// const DEFAULT_PEN_COLOR = "rgb(131, 137, 150)"
const DEFAULT_PEN_COLOR = "#838996"
let globalGridSize
let rainbowColors
let shading
let eraser
let currentPenColor
let currentBgColor

// Getting all necessary elements from the DOM
const canvas = document.querySelector("#canvas")
const gridSizeInput = document.querySelector("#grid_size")
const gridSizeLabel = document.querySelector("label[for='grid_size']")
const gridSizeForm = document.querySelector("div.canvas__grid")
const gridSizeIncrementor = document.querySelector("button#grid_size_inc")
const gridSizeDecrementor = document.querySelector("button#grid_size_dec")
const gridLinesToggler = document.querySelector("#grid-lines")
const clearGrid = document.querySelector("#clear")
const radioButtons = document.querySelectorAll("input[type='radio']")
const penColor = document.querySelector("#pen_color")
const bgColor = document.querySelector("#bg_color")
const penRecentView = document.querySelector("#recent_pen_colors")
const bgRecentView = document.querySelector("#recent_bg_colors")
const downloadButton = document.querySelector(".btn--download")

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
    globalGridSize = gridSize
    gridSizeInput.value = gridSize
    gridSizeLabel.textContent = "X " + gridSize
    generateGrids(gridSize)
    localStorage.setItem("gridSize", gridSize)
}

const setInitialGridSize = () => {
    globalGridSize = localStorage.getItem("gridSize") || DEFAULT_GRID_SIZE
    updateDOM(globalGridSize)
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
    if (localStorage.getItem("gridLines")) {
        canvas.classList.add("canvas--grid-lines")
        gridLinesToggler.checked = true
    }
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

clearGrid.addEventListener("click", () => {
    canvas.classList.add("shake")
    setTimeout(() => {
        generateGrids(globalGridSize)
        canvas.classList.remove("shake")
    }, 500)
})

const resetAllRadioButtonsExcept = radioButton => {
    radioButtons.forEach(iteratorRadioButton => {
        if (radioButton !== iteratorRadioButton)
            iteratorRadioButton.checked = false
    })
}

const checkAndGetRadioButtonValues = (variable, radioButton) => {
    if (variable === radioButton.value) {
        radioButton.checked = false
        return ""
    }

    return radioButton.value
}

radioButtons.forEach(radioButton => {
    radioButton.addEventListener("click", event => {
        resetAllRadioButtonsExcept(radioButton)

        switch(radioButton.name) {
            case "shading":
                // Before checking the value, reset the other options
                eraser = rainbowColors = ""
                shading = checkAndGetRadioButtonValues(shading, radioButton)

                if (shading) {
                    console.log("call shading function")
                }
                break
            case "rainbow":
                eraser = shading = ""
                rainbowColors = checkAndGetRadioButtonValues(
                    rainbowColors, radioButton)

                if (rainbowColors) {
                    console.log("call the rainbow function")
                }
                break
            case "eraser":
                shading = rainbowColors = ""
                eraser = checkAndGetRadioButtonValues(eraser, radioButton)

                if (eraser) {
                    console.log("call the erase function")
                }
                break
        }
    })
});

const convertHEXToRGB = hex => {
    // match each value to the group and then parseInt using HEX
    let group = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return group ?
        `rgb(${parseInt(group[1], 16)}, ${parseInt(group[2], 16)}, ${parseInt(group[3], 16)})`
        : null
}

const createRecentViewElement = color => {
    let viewItem = document.createElement("li")
    viewItem.setAttribute("data-color", color)
    viewItem.style.color = color
    
    let deleteButton = document.createElement("span")
    deleteButton.classList.add("colors__icon")

    let deleteIcon = document.createElement("i")
    deleteIcon.setAttribute("data-feather", "trash-2")
    deleteButton.appendChild(deleteIcon)
    viewItem.appendChild(deleteButton)

    return viewItem
}

const deleteColor = colorNode => {
    let parent = colorNode.parentNode
    let type = parent === penRecentView ? "pen" : "bg"
    let color = colorNode.getAttribute("data-color")
    let colors = localStorage.getItem(type + "Colors").split(",")
    let colorIndex = colors.indexOf(color)
    
    if (colorIndex !== -1) {
        colors.splice(colorIndex, 1)
        localStorage.setItem(type + "Colors", colors)
    }
    parent.removeChild(colorNode)
}

const attachSelectEventListener = (type, buttons) => {
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            let type = button.parentNode === penRecentView ? "pen" : "bg"
            let value = button.getAttribute("data-color")
            updateLocalColors(type, value)
        })
    })
}

const attachDeleteEventListener = (type, buttons) => {
    buttons.forEach(button => {
        button.addEventListener("click", event => {
            event.stopPropagation()
            let type = button.parentNode.parentNode === penRecentView ?
                "pen" : "bg"
            deleteColor(button.parentNode)
            setInitialColor(type)
        })
    })
}

const updateColorButtons = (type, parent) => {
    let selectButtons = parent.querySelectorAll("li")
    let deleteButtons = parent.querySelectorAll(".colors__icon")

    attachSelectEventListener(type, selectButtons)
    attachDeleteEventListener(type, deleteButtons)
}

const updateRecentView = (type, colors) => {
    let elementToWorkOn = type === "pen" ? penRecentView : bgRecentView
    
    // Reset it to empty element before adding anything
    elementToWorkOn.innerHTML = ""

    colors.forEach(color => {
        elementToWorkOn.appendChild(createRecentViewElement(color))
    })

    updateColorButtons(type, elementToWorkOn)
    feather.replace()
}

const getCurrentThemeBg = () => {
    return getComputedStyle(document.body).getPropertyValue("--primary")
}

// A code to check whether the 
// colorsArr = ["#648c11", "#9932cc", "#ff4500", "#55bfec", "#ffdf00"]
// colorsArr = ["#648c11", "#9932cc", "#ff4500", "#cf1020", "#ffdf00"]
// localStorage.setItem("penColors", colorsArr)
// localStorage.setItem("bgColors", colorsArr)

const setInitialColor = type => {
    let colorsOnLocalStorage = localStorage.getItem(type + "Colors")
    colorsOnLocalStorage = colorsOnLocalStorage ? 
        colorsOnLocalStorage.split(",") : ""

    if (type == "pen") {
        currentPenColor = colorsOnLocalStorage ? 
            colorsOnLocalStorage[colorsOnLocalStorage.length - 1] :
            DEFAULT_PEN_COLOR
        // set the value on the color picker
        penColor.value = currentPenColor
    } else {
        currentBgColor = colorsOnLocalStorage ? colorsOnLocalStorage[
            colorsOnLocalStorage.length - 1] : getCurrentThemeBg()
        bgColor.value = currentBgColor
        canvas.style.backgroundColor = currentBgColor
    }

    // update the recent view, if it only exists
    if (colorsOnLocalStorage)
        updateRecentView(type, colorsOnLocalStorage.reverse())
}

const updateCurrentValues = (type, value) => {
    if (type === "pen") {
        currentPenColor = value
        penColor.value = value
    } else {
        currentBgColor = value
        bgColor.value = value
        canvas.style.backgroundColor = value
    }
}

const updateLocalColors = (type, value) => {
    let workingStorage = type + "Colors"
    let theColors = localStorage.getItem(workingStorage) ?? ""
    
    if (theColors) {
        theColors = theColors.split(",")
        let valueIndex = theColors.indexOf(value)

        if (valueIndex !== -1)
            theColors.splice(valueIndex, 1)

        theColors.push(value)
        if (theColors.length > 5) theColors.shift()
    } else
        theColors = [value]

    localStorage.setItem(workingStorage, theColors)
    updateCurrentValues(type, value)
    updateRecentView(type, theColors.reverse())
}

bgColor.addEventListener("change", () => {
    updateLocalColors("bg", bgColor.value)
})

penColor.addEventListener("change", () => {
    updateLocalColors("pen", penColor.value)
})


// code reference: https://stackoverflow.com/questions/31656689/how-to-save-img-to-users-local-computer-using-html2canvas
const saveAs = (blob, fileName) => {
    const link = document.createElement('a');
    link.download = fileName
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
}

downloadButton.addEventListener("click", () => {
    html2canvas(canvas).then(canvas => {
        canvas.toBlob(blob => {
            saveAs(blob, "Etch-a-Sketch.jpg")
        })
    })
})

// initializing the grids
setInitialGridSize()
setInitialGridLines()
setInitialColor("pen")
setInitialColor("bg")



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
    // change only the bg color
    setInitialColor("bg")
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