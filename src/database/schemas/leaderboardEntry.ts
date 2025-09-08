import mongoose, { model, SchemaTypes } from "mongoose";

const leaderboardEntry = new mongoose.Schema({
	id: {
		type: SchemaTypes.ObjectId,
		unique: true,
		required: true,
	},
	name: {
		type: String,
		default: "SEA-Player-" + Math.floor(Math.random() * 10000),
		unique: true,
		required: false,
	},
	score: {
		type: Number,
		default: 0,
		unique: false,
		required: true,
	},
	accuracy: {
		type: Number,
		default: 0.0,
		unique: false,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
		unique: false,
		required: false,
	},
});

export default model("entries", leaderboardEntry);
