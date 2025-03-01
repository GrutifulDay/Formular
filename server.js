const User = require("./models/User")

// server 
const express = require("express")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send("server bezi")
})

app.listen(PORT, () => {
    console.log((`🚀 Server běží na http://localhost:${PORT}`));
})

//  mongo 
const mongoose = require("mongoose")
require("dotenv").config() //nacitani promennych z .env

// pripojeni k MongoDB 
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('👍 pripojeno'))
.catch(err => console.error('❌ Chyba připojení k MongoDB:', err))


// testovani uzivatele 
const createTestUser = async () => {
    try {
        const newUser = new User ({
            name: "testovaci uzivatel",
            email: "text@example.com", 
            password: "heslo123"
        })

        await newUser.save() 
        console.log('👍 testovaci uzivatel vytvoren');
    } catch (error) {
        console.error('❌ Chyba při vytváření uživatele:', error)
    }
}

createTestUser()

// 
app.post("/api/users", async (req, res) => {
    try {

        // ziskani dat z pozadavku
        const { name, email, password } = req.body 

        // overeni existujiciho uzivatele
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ error: "Uzivatel s timto emailem jiz existuje"})
        }

        const newUser = new User ({ name, email, password, createdAt: new Date() })
        await newUser.save()

        res.status(201).json({ message: "uzivatel vytvoren", user: newUser})
    } catch (error) {
        console.error("❌ Chyba při vytváření uživatele:", error);
        res.status(500).json({ error: "Neco se pokazilo"})
    }
})