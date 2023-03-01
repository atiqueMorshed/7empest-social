import * as dotenv from "dotenv";
dotenv.config();
//
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";

const app = express();
app.use(express.json());

// Secure app with http headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Logging
app.use(morgan("common"));

// DB Connection
connectDB();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
	res.status(200).send("OK");
});

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`),
);
