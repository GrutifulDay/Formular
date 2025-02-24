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

