import { app } from "./createApp";
import conn from "./database/db";

import router from "./routes/router";

conn();

app.use(router);

app.listen(3366, () => {
	console.log("Up and running!");
});

process.on("SIGTERM", () => {
	console.log("SIGTERM received");
	process.exit(0);
});
