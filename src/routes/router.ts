import express from "express";
import leaderboard from "./leaderboard/route";
import stats from "./stats/route";

const router = express.Router();

router.get("/", (req, res) => {
	res.send({ message: "hello world!!" });
});

router.use(leaderboard);
router.use(stats);

export default router;
