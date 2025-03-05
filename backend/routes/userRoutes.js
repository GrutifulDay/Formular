// 📌 Uživatelské operace – získání profilu uživatele

import express from "express";
import safeToken from "../middleware/safeToken.js"; // ✅ Musí obsahovat .js na konci

const router = express.Router();

// ✅ Chráněná route pro získání profilu uživatele
router.get("/profile", safeToken, (req, res) => {
    res.json({ message: "✅ Přístup povolen", user: req.user });
});

// ✅ Opravený export pro ES moduly
export default router;
