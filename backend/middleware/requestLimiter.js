import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 3,
	// eslint-disable-next-line no-unused-vars
	message: async (req, res) => "You can only make 3 requests every  minute.",
	handler: (request, response, next, options) =>
		response.status(options.statusCode).json({
			success: false,
			message: "You can only make 3 requests every  minute.",
		}),
	standardHeaders: true,
	legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 2,
	// eslint-disable-next-line no-unused-vars
	message: async (req, res) => "You can only make 2 requests every 10 minutes.",
	handler: (request, response, next, options) =>
		response.status(options.statusCode).json({
			success: false,
			message: "You can only make 2 requests every 10 minutes.",
		}),
	standardHeaders: true,
	legacyHeaders: false,
});
