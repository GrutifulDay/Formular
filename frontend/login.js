window.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username")
    const greetingElement = document.getElementById("greeting")

    if (username) {
        greetingElement.textContent = "Ahoj" + username  + "!"
    } else {
        greetingElement.textContent = "Ahoj uživateli"
    }
})