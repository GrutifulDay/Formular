document.addEventListener("DOMContentLoaded", async ()=> {
    const username = localStorage.getItem("username")

    if (username) {
        document.getElementById("username").textContent = username
    } else {
        window.location.href = "registration.html"
    }

    fetchMarvel()   
})

function fetchMarvel() {
    const heroImage = document.getElementById("heroImage")
    const heroDescription = document.getElementById("heroDescription");
    const alterEgos = document.getElementById("alterEgos")

    // random img pri nacteni stranky 
    const randomId = Math.floor(Math.random() * 731) + 1

    fetch(`https://akabab.github.io/superhero-api/api/id/${randomId}.json`) 
        .then(response => response.json())  
        .then(data => {  
            heroImage.src = data.images.lg;  
            heroDescription.textContent = data.biography.fullName || "Neznámý hrdina";  
            alterEgos.textContent = data.biography.alterEgos
        })
        .catch(error => console.error("Chyba při načítání hrdiny:", error)); 
}



document.getElementById("logoutButton").addEventListener("click", async () => {
    
    localStorage.removeItem("username")
    window.location.href = "registration.html"
})