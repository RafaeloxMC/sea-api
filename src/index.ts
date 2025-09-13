import { app } from "./createApp";
import conn from "./database/db";
import router from "./routes/router";

async function startServer() {
	try {
		await conn();
		console.log("Database connected successfully");

		app.use(router);

		app.listen(3366, () => {
			console.log("Up and running!");
		});
	} catch (error) {
		console.error("Failed to connect to database:", error);
		process.exit(1);
	}
}

startServer();

process.on("SIGTERM", () => {
	console.log("SIGTERM received");
	process.exit(0);
});
