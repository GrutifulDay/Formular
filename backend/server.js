/**
 * 
 * - Připojuje MongoDB přes `config/db.js`
 * - Definuje middleware pro CORS, JSON a statické soubory
 * - Registruje API routy pro autentizaci a uživatele
 * - Spouští server na daném portu
 */

import dotenv from "dotenv"; 
dotenv.config(); // ✅ Musí být nahoře, než se načte DB

import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // ✅ Oprava __dirname
import { dirname } from "path";
import cors from "cors";
import "./config/db.js"; // ✅ Připojení k DB přes vlastní soubor
import authRoutes from "./routes/authRoutes.js"; // ✅ Přihlášení + registrace
import userRoutes from "./routes/userRoutes.js"; // ✅ Ostatní uživatelské operace
import heroRoutes from "./routes/heroRoutes.js"; // ✅ Importujeme novou routu

console.log("🔍 DEBUG v server.js: MONGO_URI =", process.env.MONGO_URI);


const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Oprava __dirname v ES modulech
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🔍 DEBUG: MONGO_URI =", process.env.MONGO_URI);

app.set("trust proxy", 1);


// Fetch Marvel
app.get('/api/characters', async (req, res) => {
    const ts = Date.now();
    const hash = crypto.createHash('md5').update(ts + process.env.PRIVATE_KEY_MARVEL + process.env.PUBLIC_KEY_MARVEL).digest('hex');

    const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${process.env.PUBLIC_KEY_MARVEL}&hash=${hash}`;
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
});

// ✅ Middleware
app.use(express.json()); // 📌 Automatická konverze JSON
app.use(cors()); // 📌 Povolení CORS pro komunikaci mezi frontendem a backendem
app.use(express.static(path.join(__dirname, "../frontend"))); // 📌 Statické soubory

// ✅ Middleware pro správné nastavení odpovědi jako JSON
app.use(cors({
    origin: "http://127.0.0.1:5501", // ✅ Povolení pro tvůj frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // ✅ Povolení pro přihlášení
}))

// ✅ API Routes - registrace 
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hero", heroRoutes);

// ✅ Testovací GET endpoint (pro kontrolu připojení)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/registration.html"));
});


// ✅ Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`);
});