document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault()

    const name = document.getElementById("name").value.trim()
    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value.trim()
    const confirmPassword = document.getElementById("confirmPassword").value.trim()
    const errorMessage = document.getElementById("errorMessage").value.trim()

    // reset chyby
    errorMessage.textContent = "" 

    if (password !== confirmPassword) {
        errorMessage.textContent = "Hesla se neshodují"
        return
    }

    if (password.length < 6) {
        errorMessage.textContent = "Heslo musí mí alespoň 6 znaků"
        return
    }

    // odesilani dat na backend - zmenit v pripade jineho serveru / URL
    try {
        const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registrace Selhala")
        }

       // Uložíme jméno do localStorage
        localStorage.setItem("username", name);

        alert("Registrace úspěšná!")

        window.location.href = "login.html";
        } catch (error) {
        errorMessage.textContent = error.message;
    }
})