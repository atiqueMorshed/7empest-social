import * as dotenv from "dotenv";
dotenv.config();
//
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/connectDB.js";
import corsOptions from "./config/corsOptions.js";
import errorHandler from "./middleware/errorHandler.js";
import verifyJWT from "./middleware/verifyJWT.js";
import authRoute from "./routes/auth.js";
// CONFIG
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb", extended: true }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
// app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(cookieParser());

// Secure app with http headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Logging
app.use(morgan("common"));

// Assets Directory
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// DB Connection
connectDB();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
	res.status(200).send("OK");
});

app.use("/api/auth", authRoute);

app.get("/secret", verifyJWT, (req, res) => {
	res.status(200).json({ success: true, message: "VERY SECRET!" });
});

// Error Handler middleware
app.use(errorHandler);

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`),
);
