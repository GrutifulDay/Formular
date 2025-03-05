import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // ✅ MUSI BYT, PROTOZE SE PAK NENACITA A HAZÍ CHYBU 

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

// Spuštění připojení k databázi
connectDB();

// ✅ Opravený export pro ES moduly
export default mongoose;
