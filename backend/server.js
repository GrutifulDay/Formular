const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
require("dotenv").config()

const User = require("./models/User") // ✅ Správná cesta k modelu

// Vytvoření serveru
const app = express()
const PORT = process.env.PORT || 5500

// Middleware
app.use(express.json()) // ✅ Parsování JSON těla požadavků
app.use(express.static(path.join(__dirname, "../frontend"))) // ✅ Servírování frontend složky

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('👍 Připojeno k MongoDB'))
    .catch(err => console.error('❌ Chyba připojení k MongoDB:', err))

// Testovací GET endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

// Vytvoření testovacího uživatele
const createTestUser = async () => {
    try {
        const newUser = new User({
            name: "testovaci uzivatel",
            email: "text@example.com",
            password: "heslo123"
        })
        await newUser.save()
        console.log('👍 Testovací uživatel vytvořen')
    } catch (error) {
        console.error('❌ Chyba při vytváření uživatele:', error)
    }
}

// Spustíme vytvoření testovacího uživatele
createTestUser()

// Endpoint pro registraci uživatele (POST /api/users)
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Ověření existujícího e-mailu
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ error: "😱 Uživatel s tímto emailem již existuje" })
        }

        // Ověření existujícího uživatelského jména
        const existingName = await User.findOne({ name })
        if (existingName) {
            return res.status(400).json({ error: "🤔 Uživatel s tímto jménem již existuje" })
        }

        // Pokud uživatel neexistuje, vytvoříme ho
        const newUser = new User({
            name,
            email,
            password,
            createdAt: new Date()
        })
        await newUser.save()

        res.status(201).json({ message: "👍 Uživatel vytvořen", user: newUser })
    } catch (error) {
        console.error("❌ Chyba při registraci uživatele:", error.message)
        res.status(500).json({ error: error.message })
    }
})

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`)
})
