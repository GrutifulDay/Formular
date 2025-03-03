// Připojení k MongoDB

const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("👍 Připojeno k MongoDB"))
    .catch((err) => console.error("❌ Chyba připojení k MongoDB:", err))

module.exports = mongoose
