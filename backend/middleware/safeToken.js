// Middleware pro ověření JWT

const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const token = req.header("Authorization")

    if (!token) {
        return res.status(401).json({ error: "❌ Přístup zamítnut (chybí token)" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ error: "❌ Neplatný token" })
    }
}
