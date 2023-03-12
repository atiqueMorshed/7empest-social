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
		username,
		email,
		password,
		confirmPassword,
		location,
		occupation,
	} = req.body;

	const { filename } = req?.file || {};
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
		avatar: filename,
		username: username.toLowerCase(),
		email: email.toLowerCase(),
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

	const user = await User.findOne({ email: email.toLowerCase() }).select(
		"password currentSalt",
	);

	if (!user) return next(new ErrorResponse("No user found.", 404));

	const isMatch = await user.matchPasswords(password);
	if (!isMatch) return next(new ErrorResponse("Invalid password.", 401));

	await sendToken(res, user, 200);
});

// @access Private
// @desc Logged in user data
// @route /auth/getuser POST
// @req.body email, password
export const getUser = asyncHandler(async (req, res, next) => {
	const { userId } = req;
	if (!userId)
		return next(new ErrorResponse("Could not receive user ID.", 404));

	const user = await User.findById(userId);
	if (!user) return next(new ErrorResponse("No user found.", 404));

	console.log(user);

	res.status(200).json({ success: true, user });
});

// @access Public
// @desc Check user authorization
// @route /auth/check GET
export const checkAuthorization = (req, res) => {
	res
		.status(200)
		.json({ success: true, message: "The user authorization was successful." });
};

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
	//
	const refreshToken = req.cookies?.tempestRefreshToken;

	if (!refreshToken) {
		return next(new ErrorResponse("Auth Error: (No RT).", 404));
	}
	jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET,
		asyncHandler(async (err, refreshPayload) => {
			// For refresh token error, we will remove the cookie and logout user.
			if (err) {
				if (err?.message === "jwt expired") {
					const correctRefreshPayload = jwt.verify(
						refreshToken,
						process.env.JWT_REFRESH_SECRET,
						{ ignoreExpiration: true },
					);
					// For expired refresh tokens, we will just update user currentSalt so that any other active snatched refresh tokens will become invalid
					// And will clear cookie + trigger logout.
					const user = await User.findById(
						correctRefreshPayload?.id,
						"currentSalt",
					);
					if (!user) {
						clearRefreshCookie(res);
						return next(
							new ErrorResponse("Auth Error (RT): User not found [x1].", 404),
						);
					}
					user.getSignedJWTTokens(); // Increases currentSalt
					await user.save();
				}
				// Remove cookie and trigger logout
				clearRefreshCookie(res);
				return next(
					new ErrorResponse(
						`Auth Error (RT): ${err?.message || "Infected RT"}`,
						406,
					),
				);
			}

			if (!refreshPayload?.id || !refreshPayload?.cs) {
				clearRefreshCookie(res);
				return next(new ErrorResponse("Auth Error: Incorrect RT.", 406));
			}
			// Here, we have valid refresh token.
			const user = await User.findById(refreshPayload.id, "currentSalt");
			if (!user) {
				clearRefreshCookie(res);
				return next(
					new ErrorResponse("Auth Error (RT): No user found [x2].", 404),
				);
			}
			// For refresh tokens with old currentSalt, we clear cookie & trigger logout
			if (user.currentSalt !== refreshPayload?.cs) {
				user.getSignedJWTTokens(); // Increases currentSalt
				await user.save();
				clearRefreshCookie(res);
				return next(new ErrorResponse("Auth Error: Old RT.", 406));
			}

			const authHeader =
				req.headers?.Authorization || req.headers?.authorization;
			if (!authHeader?.startsWith("Bearer ")) {
				clearRefreshCookie(res);
				return next(new ErrorResponse("Auth Error: No Bearer.", 404));
			}

			const accessToken = authHeader.split(" ")[1];
			if (!accessToken) {
				clearRefreshCookie(res);
				return next(new ErrorResponse("Auth Error: No AT.", 404));
			}
			// We validate accessToken with ignoreExpiration flag.
			jwt.verify(
				accessToken,
				process.env.JWT_ACCESS_SECRET,
				{ ignoreExpiration: true },
				asyncHandler(async (err, accessPayload) => {
					if (err) {
						clearRefreshCookie(res);
						console.log(accessToken);
						return next(
							new ErrorResponse(`Auth Error (AT): ${err?.message}`, 401),
						);
					}

					// Now that the access token is expired.
					// Here we check if the access token information is sound
					// If it is, we generate new tokens and currentSalts.
					if (
						user?._id?.equals(accessPayload?.id) &&
						user?.currentSalt === accessPayload?.cs
					) {
						// Every token is sound and currentSalt is latest. So, we send new tokens.
						await sendToken(res, user, 200);
					} else {
						clearRefreshCookie(res);
						return next(new ErrorResponse("Auth Error: infected AT", 406));
					}
				}),
			);
		}),
	);

	//
	//
	// const refreshToken = req.cookies?.tempestRefreshToken;

	// if (!refreshToken) return next(new ErrorResponse("Not authorized.", 401));

	// const refreshPayload = jwt.verify(
	// 	refreshToken,
	// 	process.env.JWT_REFRESH_SECRET,
	// );
	// if (!refreshPayload?.id)
	// 	return next(new ErrorResponse("Not authorized.", 401));

	// const authHeader = req.headers?.Authorization || req.headers?.authorization;
	// if (!authHeader?.startsWith("Bearer ")) {
	// 	return next(new ErrorResponse("Not authorized.", 401));
	// }

	// const accessToken = authHeader.split(" ")[1];
	// if (!accessToken) {
	// 	return next(new ErrorResponse("Not authorized.", 401));
	// }

	// const accessPayload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, {
	// 	ignoreExpiration: true,
	// });

	// if (!accessPayload?.id)
	// 	return next(new ErrorResponse("Not authorized.", 401));
	// if (
	// 	accessPayload.id !== refreshPayload.id ||
	// 	accessPayload.cs !== refreshPayload.cs
	// )
	// 	return next(new ErrorResponse("Not authorized.", 401));

	// const user = await User.findById(
	// 	refreshPayload.id,
	// 	"refreshToken currentSalt",
	// );

	// if (!user) return next(new ErrorResponse("No user found.", 404));

	// if (refreshPayload?.cs !== user.currentSalt)
	// 	return next(new ErrorResponse("Not authorized.", 401));

	// await sendToken(res, user, 200);
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
