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

// Socket Server
export const io = new Server(server, {
	cors: corsOptions,
});

// Set up Socket.IO namespaces
const connectStatusNamespace = io.of("/connect-status");

connectStatusNamespace.on("connection", (socket) => {
	console.log("connected to the set online namespace.");
	socket.on("online", (userId) => {
		socket_users[userId] = socket.id;
		console.log("C");
		console.log(socket_users);
	});
	socket.on("offline", (userId) => {
		console.log("disconnected from the set online namespace.");
		delete socket_users[userId];
	});
});

// const followerNamespace = io.of("/follower");

// followerNamespace.on("connection", (socket) => {
// 	console.log("A new client connected to the set online namespace.");
// 	socket.on("online", (userId) => {
// 		socket_users[userId] = socket.id;
// 	});
// 	socket.on("offline", (userId) => {
// 		console.log("A client disconnected from the set online namespace.");
// 		delete socket_users[userId];
// 	});
// });

// app.use(responseHandler);

app.use((req, res, next) => {
	req.io = io;
	next();
});

// eslint-disable-next-line no-unused-vars
// io.on("connection", function (socket) {
// 	console.log("socket.io connection made");
// });

// Routes
app.get("/", (req, res) => {
	res.status(200).send("OK");
});

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/unsafeWarning", unsafeWARNINGUpdateDBRoute);

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
