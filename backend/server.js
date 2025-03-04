/**
 * ✅ Hlavní serverový soubor pro projekt Pozdrav
 * - Připojuje MongoDB přes `config/db.js`
 * - Definuje middleware pro CORS, JSON a statické soubory
 * - Registruje API routy pro autentizaci a uživatele
 * - Spouští server na daném portu
 */

require("dotenv").config(); // ✅ Musí být nahoře, aby se proměnné načetly dřív, než se použijí!

const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("./config/db"); // ✅ Připojení k DB přes vlastní soubor
const authRoutes = require("./routes/authRoutes"); // ✅ Přihlášení + registrace
const userRoutes = require("./routes/userRoutes"); // ✅ Ostatní uživatelské operace

const app = express();
const PORT = process.env.PORT || 3000;

console.log("🔍 DEBUG: MONGO_URI =", process.env.MONGO_URI);

app.set("trust proxy", 1);

// ✅ Middleware
app.use(express.json()); // 📌 Automatická konverze JSON
app.use(cors()); // 📌 Povolení CORS pro komunikaci mezi frontendem a backendem
app.use(express.static(path.join(__dirname, "../frontend"))); // 📌 Statické soubory

// ✅ Middleware pro správné nastavení odpovědi jako JSON
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    console.log(`🔍 [${req.method}] ${req.url}`);
    next();
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ✅ Testovací GET endpoint (pro kontrolu připojení)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/registration.html"));
});

// ✅ Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`);
});
