document.addEventListener("DOMContentLoaded", ()=> {
    const username = localStorage.getItem("username")

    if (username) {
        document.getElementById("username").textContent = username
    } else {
        window.location.href = "index.html"
    }
})