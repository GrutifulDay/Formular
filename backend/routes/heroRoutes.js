// Přidává endpoint /api/hero, který vrací náhodného hrdinu
// Endpoint je chráněný – pouze pro přihlášené uživatele
// Používá node-fetch pro získání dat z API

import express from "express";
import fetch from "node-fetch";
import verifyToken from "../middleware/authMiddleware.js"; // ✅ Ověření přihlášení

const router = express.Router();
const HERO_API_URL = process.env.HERO_API_URL;
console.log("🔍 DEBUG: HERO_API_URL =", process.env.HERO_API_URL);

// ✅ Endpoint pro získání náhodného hrdiny (přístupný jen přihlášeným uživatelům)
router.get("/", verifyToken, async (req, res) => {
    try {
        const response = await fetch(HERO_API_URL);
        const data = await response.json();
        const randomHero = data[Math.floor(Math.random() * data.length)];

        res.json(randomHero);
    } catch (error) {
        res.status(500).json({ error: "Chyba při získávání hrdiny" });
    }
});

// ✅ Opravený export pro ES moduly
export default router;
