document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target // ulozim cely formular 
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    // Reset chyby zpravy
    errorMessage.textContent = "";

    if (password !== confirmPassword) {
        errorMessage.textContent = "Hesla se neshodují";
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = "Heslo musí mít alespoň 6 znaků";
        return;
    }

    console.log("➡️ Odesílám request na backend:", { name, email, password });

    // Odesílání dat na backend
    try {
        const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Registrace selhala");
        }

        // ulozim jmeno do localStorage
        localStorage.setItem("username", name);

        console.log("✅ Registrace úspěšná! Uživatel:", data);

        form.reset()

    } catch (error) {
        errorMessage.textContent = error.message;
        console.error("❌ Chyba registrace:", error.message);
    }
});
