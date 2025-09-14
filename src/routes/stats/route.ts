import express from "express";
import leaderboardEntry from "../../database/schemas/leaderboardEntry";

const router = express.Router();

router.get("/stats", async (req, res) => {
	const entries = await leaderboardEntry.find({});

	const size = entries.length;
	const best_accuracy = entries.sort((a, b) => b.accuracy - a.accuracy)[0];
	const high_score = entries.sort((a, b) => b.score - a.score)[0];

	res.status(200).json({
		size,
		best_accuracy,
		high_score,
	});
});

export default router;
