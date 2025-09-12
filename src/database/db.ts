import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default function conn() {
	console.log("Connecting to MongoDB...");
	mongoose.connect(process.env.DB_URI ?? "");
}
