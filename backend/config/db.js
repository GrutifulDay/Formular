// Připojení k MongoDB

// const mongoose = require("mongoose")

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("👍 Připojeno k MongoDB"))
//     .catch((err) => console.error("❌ Chyba připojení k MongoDB:", err))

// module.exports = mongoose


const mongoose = require("mongoose");

console.log("🔍 DEBUG v db.js: MONGO_URI =", process.env.MONGO_URI);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ MONGO_URI není definováno!");
        }

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Připojeno k MongoDB");
    } catch (err) {
        console.error("❌ Chyba připojení k MongoDB:", err);
        process.exit(1);
    }
};

connectDB();

module.exports = mongoose;
