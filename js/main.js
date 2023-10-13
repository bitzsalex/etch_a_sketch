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