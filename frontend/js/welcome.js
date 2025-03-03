document.addEventListener("DOMContentLoaded", async ()=> {
    const username = localStorage.getItem("username")

    if (username) {
        document.getElementById("username").textContent = username
    } else {
        window.location.href = "registration.html"
    }
})

document.getElementById("logoutButton").addEventListener("click", async () => {
    
    localStorage.removeItem("username")
    window.location.href = "registration.html"
})