// Middleware pro ověření JWT (JSON Web Token)
import jwt from "jsonwebtoken";

const jwtMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]; // Načteme token z hlavičky

    if (!token) {
        return res.status(401).json({ error: "❌ Přístup zamítnut (chybí token)" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "❌ Neplatný token" });
    }
};

// ✅ Opravený export pro ES moduly
export default jwtMiddleware;
