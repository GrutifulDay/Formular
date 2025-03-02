const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")

dotenv.config()
const User = require("./models/User") // ✅ Opravená cesta

// Vytvoření serveru
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json()) // ✅ Parsování JSON těla požadavků
app.use(cors()) // ✅ Povolení požadavků z frontendového portu
app.use(express.static(path.join(__dirname, "../frontend"))) // ✅ Servírování frontend složky

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('👍 Připojeno k MongoDB'))
    .catch(err => console.error('❌ Chyba připojení k MongoDB:', err))

// Testovací GET endpoint
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

// Endpoint pro registraci uživatele (POST /api/users)
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Ověření, zda existuje email nebo jméno
        if (await User.findOne({ email })) {
            return res.status(400).json({ error: "😱 Uživatel s tímto emailem již existuje" })
        }
        if (await User.findOne({ name })) {
            return res.status(400).json({ error: "🤔 Uživatel s tímto jménem již existuje" })
        }

        // Hashování hesla
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Vytvoření nového uživatele
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // ✅ Ukládáme hashované heslo
            createdAt: new Date()
        })

        await newUser.save()
        res.status(201).json({ message: "👍 Uživatel vytvořen", user: newUser })

    } catch (error) {
        console.error("❌ Chyba při registraci uživatele:", error)
        res.status(500).json({ error: "Chyba serveru" })
    }
})

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`)
})


