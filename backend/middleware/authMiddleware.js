// Overuje zda obsahuje JWL token, pokud chybi odpovi 403, 
// pokud je neplatny nebo vyprsel 401,
// platny - pusti dal 

import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    console.log("📡 DEBUG: authHeader =", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ Chyba: Token chybí nebo má špatný formát");
        return res.status(403).json({ error: "Přístup odepřen, chybí token" });
    }

    const token = authHeader.split(" ")[1];

    console.log("📡 DEBUG: Token extrahován =", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("❌ Chyba ověření tokenu:", err);
            return res.status(401).json({ error: "Neplatný nebo vypršený token" });
        }
        req.user = user;
        console.log("✅ Token ověřen:", user);
        next();
    });
};

export default verifyToken;
