import * as dotenv from "dotenv";
dotenv.config();
//
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import connectDB from "./config/connectDB.js";
import corsOptions from "./config/corsOptions.js";
import errorHandler from "./middleware/errorHandler.js";
import responseHandler from "./middleware/responseHandler.js";
import authRoute from "./routes/auth.js";
import postsRoute from "./routes/posts.js";
import unsafeWARNINGUpdateDBRoute from "./routes/unsafeWARNINGUpdateDB.js";
import usersRoute from "./routes/users.js";

// CONFIG
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
export const socket_users = {};

const app = express();

// Socket Config
// const httpServer = http.createServer(app);

// const io = new Server(httpServer, {
// 	cors: corsOptions,
// });

app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb", extended: true }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
// app.use(cookieParser());

// Secure app with http headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Logging
app.use(morgan("common"));

// Assets Directory
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// DB Connection
connectDB();

const server = app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`),
);

export const io = new Server(server, {
	cors: corsOptions,
});
// app.set("socketio", io);

// io.on("connection", (socket) => {
// 	socket.on("addSocketUser", (userId) => {
// 		socket_users[userId] = socket.id;
// 		console.log(socket_users);
// 	});

// 	socket.on("removeSocketUser", (userId) => {
// 		delete socket_users[userId];
// 		console.log(socket_users);
// 	});
// });
io.emit("socketUsers", {
	data: "LOL",
});

app.use(responseHandler);

// app.use((req, res, next) => {
// 	io.on("connection", (socket) => {
// 		req.io = io;
// 		req.socket = socket;
// 	});
// 	next();
// });

// Routes
app.get("/", (req, res) => {
	res.status(200).send("OK");
});

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/unsafeWarning", unsafeWARNINGUpdateDBRoute);

//
// app.use((err, req, res, next) => {
// 	let oldSend = res.send;

// 	const path = req.path;
// 	const method = req.method;

// 	console.log("method");
// 	console.log(path);
// 	console.log(method);

// 	// if (
// 	// 	path.includes("/conversations") &&
// 	// 	(method === "POST" || method === "PATCH")
// 	// ) {
// 	// 	// emit socket event.
// 	// 	// here, the first param is the event name (can be anything).
// 	// 	io.emit("conversations", {
// 	// 		data: res.locals.data,
// 	// 	});
// 	// } else if (path.includes("/messages") && method === "POST") {
// 	// 	io.emit("messages", {
// 	// 		data: res.locals.data,
// 	// 	});
// 	// }
// 	res.send = function (data) {
// 		console.log(data);
// 		oldSend.apply(res, arguments);
// 	};
// 	next();
// });

// Error Handler middleware
app.use(errorHandler);

// httpServer.listen(SOCKET_PORT);

process.on("SIGINT", function () {
	mongoose.connection.close(function () {
		console.log(
			"Mongoose default connection disconnected through app termination",
		);
		process.exit(0);
	});
});
