import mongoose from "mongoose";

export function conn() {
	console.log("Connecting to MongoDB...");
	mongoose.connect(process.env.DB_URI ?? "");
}
