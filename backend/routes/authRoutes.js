/**
 * ✅ Router pro autentizaci uživatelů
 * Obsahuje přihlášení, registraci a middleware pro logování.
 *
 * Používá: controllers/authController.js
 */

const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const rateLimit = require("express-rate-limit")

const router = express.Router()

// ✅ Middleware pro logování příchozích requestů
router.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    console.log(`🔍 [${req.method}] ${req.url}`);
    next();
});

// ✅ Omezení počtu pokusů o přihlášení (Rate Limiting)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minut
    max: 5, // Max 5 pokusů
    message: { error: "⛔ Příliš mnoho pokusů, zkuste to znovu za 15 minut." },
    handler: (req, res, next) => {
        console.warn(`⛔ RATE-LIMIT TRIGGERED pro IP: ${req.ip}`)
        res.status(429).json({ error: "⛔ Příliš mnoho pokusů, zkuste to znovu za 15 minut." })
    }
});

// ✅ **Přihlášení uživatele**
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ error: "❌ Uživatel neexistuje" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: "❌ Nesprávné heslo" })
        }

        // ✅ Vytvoření JWT tokenu
        const token = jwt.sign(
            { userId: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.json({
            message: "✅ Přihlášení úspěšné!",
            token,
            user: { name: user.name, email: user.email },
        })
    } catch (error) {
        console.error("❌ Chyba při přihlašování:", error)
        res.status(500).json({ error: "Chyba serveru" })
    }
});

// ✅ **Registrace uživatele**
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (await User.findOne({ email })) {
            return res.status(400).json({ error: "😱 Uživatel s tímto emailem již existuje" })
        }
        if (await User.findOne({ name })) {
            return res.status(400).json({ error: "🤔 Uživatel s tímto jménem již existuje" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        })

        await newUser.save()
        res.status(201).json({ message: "👍 Uživatel vytvořen", user: newUser })
    } catch (error) {
        console.error("❌ Chyba při registraci uživatele:", error)
        res.status(500).json({ error: "Chyba serveru" })
    }
});

module.exports = router;
