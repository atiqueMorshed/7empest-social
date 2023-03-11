import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/ErrorResponse.js";
import clearRefreshCookie from "../utils/clearRefreshCookie.js";

const verifyJWT = async (req, res, next) => {
	console.log("-> verifyJWT");
	const refreshToken = req.cookies?.tempestRefreshToken;

	if (!refreshToken) {
		return next(new ErrorResponse("Auth Error: (No RT).", 404));
	}
	jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET,
		asyncHandler(async (err, refreshPayload) => {
			if (err) {
				clearRefreshCookie(res);
				return next(new ErrorResponse(`Auth Error (RT): ${err?.message}`, 401));
			}

			// Has Payload
			if (!refreshPayload?.id || !refreshPayload?.cs) {
				clearRefreshCookie(res);
				return next(new ErrorResponse("Auth Error: Incorrect RT.", 406));
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

			jwt.verify(
				accessToken,
				process.env.JWT_ACCESS_SECRET,
				asyncHandler(async (err, accessPayload) => {
					// Has error
					if (err) {
						if (err?.message === "jwt expired") {
							const correctAccessPayload = jwt.verify(
								accessToken,
								process.env.JWT_ACCESS_SECRET,
								{ ignoreExpiration: true },
							);
							// For expired access tokens, we want to check if the access token has same info as refreshToken
							if (
								refreshPayload?.id !== correctAccessPayload?.id ||
								refreshPayload?.cs !== correctAccessPayload?.cs
							) {
								clearRefreshCookie(res);
								return next(new ErrorResponse("Auth Error: Infected AT", 406));
							}
							// Refresh and Access token info is correct, but accessToken has expired. So, we trigger a refresh.
							else {
								return next(
									new ErrorResponse("Auth Error: Access token expired.", 403),
								);
							}
						} else {
							clearRefreshCookie(res);
							return next(
								new ErrorResponse(`Auth Error (AT): ${err?.message}`, 401),
							);
						}
					}
					// Has payload
					if (
						refreshPayload?.id !== accessPayload?.id ||
						refreshPayload?.cs !== accessPayload?.cs
					) {
						return next(
							new ErrorResponse("Auth Error: infected access token.", 401),
						);
					} else {
						console.log("verified ->");
						next();
					}
				}),
			);
		}),
	);

	//
	//

	// console.log("-> verifyJWT");
	// const refreshToken = req.cookies?.tempestRefreshToken;

	// if (!refreshToken) {
	// 	return next(new ErrorResponse("Auth Error: (No RT).", 404));
	// }
	// jwt.verify(
	// 	refreshToken,
	// 	process.env.JWT_REFRESH_SECRET,
	// 	asyncHandler(async (err, refreshPayload) => {
	// 		if (err) {
	// 			clearRefreshCookie(res);
	// 			return next(new ErrorResponse(`Auth Error (RT): ${err?.message}`, 401));
	// 		}

	// 		if (!refreshPayload?.id) {
	// 			clearRefreshCookie(res);
	// 			return next(new ErrorResponse("Auth Error: Incorrect RT.", 406));
	// 		}
	// 		const user = await User.findById(refreshPayload.id, "+currentSalt");
	// 		if (!user) {
	// 			clearRefreshCookie(res);
	// 			return next(new ErrorResponse("Auth Error: No user found.", 404));
	// 		}

	// 		if (user.currentSalt !== refreshPayload.cs) {
	// 			clearRefreshCookie(res);
	// 			return next(new ErrorResponse("Auth Error: Old RT.", 406));
	// 		}

	// 		const authHeader =
	// 			req.headers?.Authorization || req.headers?.authorization;
	// 		if (!authHeader?.startsWith("Bearer ")) {
	// 			clearRefreshCookie(res);
	// 			return next(new ErrorResponse("Auth Error: No Bearer.", 404));
	// 		}

	// 		const accessToken = authHeader.split(" ")[1];
	// 		if (!accessToken) {
	// 			clearRefreshCookie(res);
	// 			return next(new ErrorResponse("Auth Error: No AT.", 404));
	// 		}

	// 		jwt.verify(
	// 			accessToken,
	// 			process.env.JWT_ACCESS_SECRET,
	// 			asyncHandler(async (err, accessPayload) => {
	// 				if (err) {
	// 					if (err?.message === "jwt expired") {
	// 						const correctAccessPayload = jwt.verify(
	// 							accessToken,
	// 							process.env.JWT_ACCESS_SECRET,
	// 							{ ignoreExpiration: true },
	// 						);
	// 						// For expired access tokens, we want to check if the access token is from correct user.
	// 						if (
	// 							user._id.equals(correctAccessPayload?.id) &&
	// 							correctAccessPayload?.cs === user.currentSalt
	// 						) {
	// 							return next(
	// 								new ErrorResponse("Auth Error: Access token expired.", 403),
	// 							);
	// 						} else {
	// 							return next(
	// 								new ErrorResponse(`Auth Error (cAT): ${err?.message}`, 406),
	// 							);
	// 						}
	// 					} else {
	// 						clearRefreshCookie(res);
	// 						return next(
	// 							new ErrorResponse(`Auth Error (AT): ${err?.message}`, 401),
	// 						);
	// 					}
	// 				}
	// 				if (accessPayload) {
	// 					if (
	// 						!user._id.equals(accessPayload?.id) ||
	// 						accessPayload?.cs !== user.currentSalt
	// 					) {
	// 						return next(
	// 							new ErrorResponse("Auth Error: infected access token.", 401),
	// 						);
	// 					} else {
	// 						console.log("verified ->");
	// 						next();
	// 					}
	// 				}
	// 			}),
	// 		);
	// 	}),
	// );
};

export default verifyJWT;
