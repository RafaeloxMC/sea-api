import express from "express";
import leaderboardEntry from "../../database/schemas/leaderboardEntry";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.use(express.json());

const activeSessions = new Map<
	string,
	{ startTime: number; expectedDuration: number }
>();
const SESSION_SECRET = process.env.SESSION_SECRET || "somesecret123456789";

router.post("/leaderboard/session", (req, res) => {
	const sessionId = crypto.randomUUID();
	const startTime = Date.now();
	const expectedDuration = 60000;

	activeSessions.set(sessionId, { startTime, expectedDuration });

	setTimeout(
		() => activeSessions.delete(sessionId),
		expectedDuration + 30000
	);

	console.log("Created session " + sessionId);

	res.json({ sessionId, startTime });
});

router.post("/leaderboard", async (req, res) => {
	try {
		if (
			!req.body ||
			req.body.sessionId === undefined ||
			req.body.score === undefined ||
			req.body.accuracy === undefined
		) {
			if (req.body) console.log(req.body);
			return res.status(400).json({ error: "Missing required fields" });
		}

		const {
			sessionId,
			score,
			accuracy,
		}: { sessionId: string; score: number; accuracy: number } = req.body;

		const session = activeSessions.get(sessionId);
		if (!session) {
			return res
				.status(400)
				.json({ error: "Invalid or expired session" });
		}

		const now = Date.now();
		const gameDuration = now - session.startTime;

		if (
			gameDuration < 10000 ||
			gameDuration > session.expectedDuration + 5000
		) {
			return res.status(400).json({ error: "Invalid game duration" });
		}

		if (!isScoreReasonable(score, accuracy, gameDuration)) {
			return res.status(400).json({ error: "Invalid score data" });
		}

		try {
			const entry = new leaderboardEntry({
				name:
					"SEA-Player-" +
					Date.now() +
					"-" +
					Math.floor(Math.random() * 1000000),
				score,
				accuracy,
				date: new Date(),
			});

			const savedEntry = await entry.save();
			activeSessions.delete(sessionId);

			return res.status(201).json({
				message: "Score submitted successfully",
				playerName: savedEntry.name,
			});
		} catch (error: any) {
			console.error("Database save error:", error);

			if (error.code === 11000) {
				try {
					const retryEntry = new leaderboardEntry({
						name:
							"SEA-Player-" +
							Date.now() +
							"-" +
							Math.floor(Math.random() * 10000000),
						score,
						accuracy,
						date: new Date(),
					});

					const savedRetryEntry = await retryEntry.save();
					activeSessions.delete(sessionId);

					return res.status(201).json({
						message: "Score submitted successfully",
						playerName: savedRetryEntry.name,
					});
				} catch (retryError) {
					console.error("Retry save error:", retryError);
					return res.status(500).json({
						error: "Failed to save score after retry",
					});
				}
			} else {
				return res.status(500).json({ error: "Failed to save score" });
			}
		}
	} catch (err) {
		console.error("Unexpected error:", err);
		return res.status(500).json({ error: "Unexpected server error" });
	}
});

function isScoreReasonable(
	score: number,
	accuracy: number,
	duration: number
): boolean {
	const maxPossibleScore = (duration / 1000) * 10;
	const minGameTime = 10000;

	if (score < 0 || score > maxPossibleScore) return false;
	if (accuracy < 0 || accuracy > 1) return false;
	if (duration < minGameTime) return false;

	return true;
}

router.get("/leaderboard", async (req, res) => {
	try {
		const entries = await leaderboardEntry
			.find()
			.sort({ score: -1 })
			.limit(100)
			.select("-_id name score accuracy date");

		res.json(entries);
	} catch {
		res.status(500).json({ error: "Failed to fetch leaderboard" });
	}
});

export default router;
