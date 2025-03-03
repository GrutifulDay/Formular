const express = require("express")
const path = require("path")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("./config/db") // ✅ Připojení k DB přes vlastní soubor
const authRoutes = require("./routes/authRoutes") // ✅ Přihlášení + registrace
const userRoutes = require("./routes/userRoutes") // ✅ Ostatní uživatelské operace

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, "../frontend")))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

// Testovací GET endpoint
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/registration.html"))
})

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`)
})
