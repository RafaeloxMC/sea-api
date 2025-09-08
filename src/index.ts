import { app } from "./createApp";

import express from "express";
import router from "./routes/router";

app.listen(3366, () => {
	console.log("Up and running!");

	app.use(router);
});

process.on("SIGTERM", () => {
	console.log("SIGTERM received");
	process.exit(0);
});
