const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // ✅ Správně importován JWT

dotenv.config()
const User = require("./models/User") // ✅ Opravená cesta

// Vytvoření serveru
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json()) // ✅ Parsování JSON těla požadavků
app.use(cors()) // ✅ Povolení požadavků z frontendového portu
app.use(express.static(path.join(__dirname, "../frontend"))) // ✅ Servírování frontend složky

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("👍 Připojeno k MongoDB"))
    .catch((err) => console.error("❌ Chyba připojení k MongoDB:", err));

// Testovací GET endpoint
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/registration.html"));
});

// ✅ **Registrace uživatele**
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Ověření, zda existuje email nebo jméno
        if (await User.findOne({ email })) {
            return res.status(400).json({ error: "😱 Uživatel s tímto emailem již existuje" })
        }
        if (await User.findOne({ name })) {
            return res.status(400).json({ error: "🤔 Uživatel s tímto jménem již existuje" })
        }

        // Hashování hesla
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Vytvoření nového uživatele
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // ✅ Ukládáme hashované heslo
            createdAt: new Date()
        })

        await newUser.save()
        res.status(201).json({ message: "👍 Uživatel vytvořen", user: newUser })

    } catch (error) {
        console.error("❌ Chyba při registraci uživatele:", error)
        res.status(500).json({ error: "Chyba serveru" })
    }
})

// ✅ **Přihlášení uživatele**
// Endpoint pro prihlaseni uživatele
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔍 Přihlášení pro:", email, "s heslem:", password);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "❌ Uživatel neexistuje" });
        }

        console.log("✅ Uživatelský účet nalezen:", user);

        // Porovnání hesla
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔐 Porovnání hesla:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: "❌ Nesprávné heslo" });
        }

        res.json({ message: "✅ Přihlášení úspěšné!", user });

    } catch (error) {
        console.error("❌ Chyba při přihlašování:", error);
        res.status(500).json({ error: "Chyba serveru" });
    }
});


// app.post("/api/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(400).json({ error: "❌ Uživatel neexistuje" });
//         }

//         // Porovnání hesla
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: "❌ Nesprávné heslo" });
//         }

//         // ✅ **Vytvoření JWT tokenu**
//         try {
//             const token = jwt.sign(
//                 { userId: user._id, name: user.name }, // ✅ Opraveno user._id místo user_id
//                 process.env.JWT_SECRET, // ✅ Tajný klíč
//                 { expiresIn: "1h" } // ✅ Token platí 1 hodinu
//             );

//             res.json({
//                 message: "✅ Přihlášení úspěšné!",
//                 token,
//                 user: { name: user.name, email: user.email },
//             });
//         } catch (tokenError) {
//             console.error("❌ Chyba při generování tokenu:", tokenError);
//             return res.status(500).json({ error: "❌ Chyba při generování tokenu" });
//         }
//     } catch (error) {
//         console.error("❌ Chyba při přihlašování:", error);
//         res.status(500).json({ error: "Chyba serveru" });
//     }
// });

// ✅ **Spuštění serveru**
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`)
})


