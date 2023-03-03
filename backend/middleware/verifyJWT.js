import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import clearRefreshCookie from "../utils/clearRefreshCookie.js";

const verifyJWT = (req, res, next) => {
	const refreshToken = req.cookies?.tempestRefreshToken;
	const userEmail = req.cookies?.tempestUserEmail;

	if (!refreshToken) {
		clearRefreshCookie(res);
		return next(new ErrorResponse("bad_jwt_Refresh token not found.", 404));
	}
	jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET,
		asyncHandler(async (err, decodedRT) => {
			if (err) {
				clearRefreshCookie(res);
				return next(
					new ErrorResponse(
						`bad_jwt_REFRESH TOKEN ERROR: ${err?.message}`,
						406,
					),
				);
			}

			const user = await User.findOne({ _id: decodedRT.id });
			if (!user) {
				clearRefreshCookie(res);
				return next(new ErrorResponse("bad_jwt_No user found.", 404));
			}

			if (user.currentRefreshSalt !== decodedRT.crs) {
				clearRefreshCookie(res);
				return next(new ErrorResponse("bad_jwt_Bad Refresh Token.", 406));
			}

			if (user.email !== userEmail) {
				clearRefreshCookie(res);
				return next(new ErrorResponse("bad_jwt_Unauthorized Email.", 401));
			}

			const authHeader =
				req.headers?.Authorization || req.headers?.authorization;
			if (!authHeader?.startsWith("Bearer ")) {
				return next(
					new ErrorResponse("bad_jwt_Unauthorized: Missing JWT header", 403),
				);
			}

			const accessToken = authHeader.split(" ")[1];
			if (!accessToken) {
				return next(
					new ErrorResponse("bad_jwt_Unauthorized: Missing access token", 403),
				);
			}

			jwt.verify(
				accessToken,
				process.env.JWT_ACCESS_SECRET,
				async (err, decodedAT) => {
					if (err)
						return next(
							new ErrorResponse(
								`bad_jwt_ACCESS TOKEN ERROR: ${err?.message}`,
								403,
							),
						);

					if (
						decodedAT.cas !== user.currentAccessSalt ||
						decodedAT.crs !== user.currentRefreshSalt
					) {
						clearRefreshCookie(res);
						return next(new ErrorResponse("bad_jwt_Bad Token(s).", 406));
					}

					if (
						!user._id.equals(decodedAT.id) &&
						!decodedAT.id.equals(decodedRT.id)
					) {
						clearRefreshCookie(res);
						return next(new ErrorResponse("bad_jwt_Bad User.", 406));
					}

					req.user = user;
					next();
				},
			);
		}),
	);
};

export default verifyJWT;
