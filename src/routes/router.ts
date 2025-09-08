import express from "express";
import leaderboard from "./leaderboard/route";

const router = express.Router();

router.get("/", (req, res) => {
	res.send({ message: "hello world!!" });
});

router.use(leaderboard);

export default router;
