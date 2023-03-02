import ErrorResponse from "../utils/ErrorResponse.js";

const errorHandler = (err, req, res) => {
	let error = { ...err };
	error.message = err.message;

	if (err.code === 11000) {
		const message = "Duplicate not allowed.";
		error = new ErrorResponse(message, 400);
	}

	if (err.name === "ValidationError") {
		const messages = Object.values(err?.errors)?.map((val) => val.message);
		error = new ErrorResponse(messages, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error?.message || "Internal Server Error (ZZ).",
	});
};

export default errorHandler;
