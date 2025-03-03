document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault()

    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value.trim()
    const errorMessage = document.getElementById("errorMessage")

    errorMessage.textContent = ""

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Přihlášení selhalo")
        }

        // Uložení jména do LocalStorage
        localStorage.setItem("username", data.user.name)

        console.log("✅ Přihlášení úspěšné!", data)
        window.location.href = "welcome.html" // Přesměrování po přihlášení

    } catch (error) {
        errorMessage.textContent = error.message
        console.error("❌ Chyba při přihlašování:", error.message)
    }
})