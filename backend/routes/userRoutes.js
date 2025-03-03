// Uživatelské operace

const express = require("express")
const safeToken = require("../middleware/safeToken")

const router = express.Router()

// ✅ Chráněná route pro získání profilu uživatele
router.get("/profile", safeToken, (req, res) => {
    res.json({ message: "✅ Přístup povolen", user: req.user })
})

module.exports = router
