import mongoose, { model, Types } from "mongoose";

const leaderboardEntry = new mongoose.Schema({
	_id: {
		type: Types.ObjectId,
		unique: true,
		required: true,
		default: new Types.ObjectId(),
	},
	name: {
		type: String,
		default: function () {
			return "SEA-Player-" + Math.floor(Math.random() * 1000000);
		},
		unique: false,
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
		default: Date.now,
		unique: false,
		required: false,
	},
});

export default model("entries", leaderboardEntry);
