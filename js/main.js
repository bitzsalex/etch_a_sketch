feather.replace()

const themeToggler = document.querySelector("button.theme__toggler")

const changeTheme = theme => {
    if (theme === "dark") {
        document.body.classList.add("dark-theme")
        localStorage.setItem("theme", "dark")
    } else {
        document.body.classList.remove("dark-theme")
        localStorage.setItem("theme", "light")
    }
}

const toggleTheme = () => {
    if (document.body.classList.contains("dark-theme")) {
        changeTheme("light")
        themeToggler.classList.remove("theme--dark")
    } else {
        changeTheme("dark")
        themeToggler.classList.add("theme--dark")
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

setTheme()

if (themeToggler)
    themeToggler.addEventListener("click", toggleTheme)