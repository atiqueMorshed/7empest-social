import crypto from "crypto";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import clearRefreshCookie from "../utils/clearRefreshCookie.js";
import { transporter } from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";

// @access Public
// @desc Register
// @route /auth/register POST
// @body username, email, password
export const register = asyncHandler(async (req, res, next) => {
	const {
		firstname,
		lastname,
		avatar,
		username,
		email,
		password,
		confirmPassword,
		location,
		occupation,
	} = req.body;

	if (
		!firstname ||
		!lastname ||
		!username ||
		!email ||
		!password ||
		!confirmPassword ||
		!location ||
		!occupation
	)
		return next(new ErrorResponse("Please fill in the required fields.", 400));

	if (password !== confirmPassword)
		return next(
			new ErrorResponse("Confirm password should match with password.", 406),
		);

	const user = await User.create({
		firstname,
		lastname,
		avatar,
		username,
		email,
		password,
		location,
		occupation,
	});

	await sendToken(res, user, 201);
});

// @access Public
// @desc Login
// @route /auth/login POST
// @req.body email, password
export const login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password)
		return next(new ErrorResponse("Email and password is required.", 400));

	const user = await User.findOne({ email }).select("password currentSalt");

	if (!user) return next(new ErrorResponse("No user found.", 404));

	const isMatch = await user.matchPasswords(password);
	if (!isMatch) return next(new ErrorResponse("Invalid password.", 401));

	await sendToken(res, user, 200);
});

// @access Public
// @desc Reset Password
// @route /auth/resetpassword/:resetToken POST
// @req.body password
// @req.params resetToken
export const resetPassword = async (req, res, next) => {
	const { resetToken } = req.params;
	const { password } = req.body;
	if (!resetToken) {
		return next(new ErrorResponse("Invalid request.", 404));
	}

	if (!password) {
		return next(new ErrorResponse("Invalid new password.", 404));
	}

	const resetTokenHashed = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	const user = await User.findOne({
		"resetPasswordToken.resetToken": resetTokenHashed,
	}).select("password resetPasswordToken.expiryDate");

	if (!user) {
		return next(
			new ErrorResponse(
				"Bad link, try copying the reset password link from email and try again.",
				401,
			),
		);
	}

	if (user.resetPasswordToken.expiryDate < new Date()) {
		return next(new ErrorResponse("Reset password link expired.", 406));
	}

	user.password = password;
	user.resetPasswordToken.resetToken = undefined;
	user.resetPasswordToken.expiryDate = undefined;
	await user.save();

	await sendToken(res, user, 201);
};

// @access Public
// @desc Forgot Password
// @route /auth/forgotpassword/ POST
// @req.body email
export const forgotPassword = async (req, res, next) => {
	const { email } = req.body;

	if (!email) return next(new ErrorResponse("Invalid request.", 404));

	const user = await User.findOne({ email: email });
	if (!user) return next(new ErrorResponse("Please enter a valid email.", 404));

	const resetToken = user.getResetPasswordToken();

	await user.save();

	const resetUrl = `${process.env.FRONTEND_BASEURL}/resetpassword/${resetToken}`;
	const htmlContent = `
			<h1>Reset password confirmation</h1>
			<p>A reset password request was made for this email on our website. Please follow the link to reset your password.</p>
			<a href=${resetUrl} clicktracking=off>${resetUrl}</a>
			<br/>
			<p>Please ignore the email if you did not make the request.</p>
		`;

	const mailOptions = {
		from: process.env.MAILTRAP_FROM,
		to: email,
		subject: "7empest-social: Reset password.",
		html: htmlContent,
	};

	// eslint-disable-next-line no-unused-vars
	transporter.sendMail(mailOptions, async function (err, info) {
		if (err) {
			user.resetPasswordToken.resetToken = "";
			user.resetPasswordToken.expiryDate = undefined;

			await user.save();
			return next(new ErrorResponse("Email could not be sent", 500));
		} else {
			return res.status(200).json({
				message: "success",
			});
		}
	});

	// SendGrid
	// try {
	// 	await sendEmail({
	// 		to: email,
	// 		subject: "MERN Auth V1: Reset password.",
	// 		htmlContent,
	// 	});
	// } catch (error) {
	// 	user.resetPasswordToken.resetToken = "";
	// 	user.resetPasswordToken.expiryDate = undefined;

	// 	await user.save();

	// 	return next(new ErrorResponse("Email could not be sent", 500));
	// }
	// res.status(200).json({
	// 	message: "success",
	// });
};

// @access Public
// @desc Refresh Access Token
// @route /auth/refresh/ GET
// @req.cookie refreshToken, userEmail
export const refresh = asyncHandler(async (req, res, next) => {
	const refreshToken = req.cookies?.tempestRefreshToken;

	if (!refreshToken) return next(new ErrorResponse("Not authorized.", 401));

	const refreshPayload = jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET,
	);
	if (!refreshPayload?.id)
		return next(new ErrorResponse("Not authorized.", 401));

	const authHeader = req.headers?.Authorization || req.headers?.authorization;
	if (!authHeader?.startsWith("Bearer ")) {
		return next(new ErrorResponse("Not authorized.", 401));
	}

	const accessToken = authHeader.split(" ")[1];
	if (!accessToken) {
		return next(new ErrorResponse("Not authorized.", 401));
	}

	const accessPayload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, {
		ignoreExpiration: true,
	});

	if (!accessPayload?.id)
		return next(new ErrorResponse("Not authorized.", 401));
	if (
		accessPayload.id !== refreshPayload.id ||
		accessPayload.cs !== refreshPayload.cs
	)
		return next(new ErrorResponse("Not authorized.", 401));

	const user = await User.findById(
		refreshPayload.id,
		"refreshToken currentSalt",
	);

	if (!user) return next(new ErrorResponse("No user found.", 404));

	if (refreshPayload?.cs !== user.currentSalt)
		return next(new ErrorResponse("Not authorized.", 401));

	await sendToken(res, user, 200);
});

// @access Public
// @desc Logout User
// @route /auth/logout/ POST
// @req.cookie refreshToken
export const logout = asyncHandler(async (req, res) => {
	const refreshToken = req.cookies?.tempestRefreshToken;
	if (!refreshToken)
		return res.status(200).json({ success: true, message: "Logged out." });

	clearRefreshCookie(res);

	const refreshPayload = jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET,
		{
			ignoreExpiration: true,
		},
	);

	if (refreshPayload?.id) {
		const user = await User.findById(refreshPayload.id, "currentSalt");
		if (user) {
			user.getSignedJWTTokens();
			await user.save();
		}
	}

	return res
		.status(200)
		.json({ success: true, message: "Logged out successfully!" });
});
