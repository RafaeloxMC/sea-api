import express from "express";

const router = express.Router();

router.get("/leaderboard", (req, res) => {
	res.send({ message: "this is the leaderboard" });
});

export default router;
