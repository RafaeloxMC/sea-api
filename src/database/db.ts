import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function conn() {
	console.log("Connecting to MongoDB...");
	await mongoose.connect(process.env.DB_URI ?? "");
}
