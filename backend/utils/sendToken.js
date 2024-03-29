const sendToken = async (res, user, statusCode) => {
	const { accessToken, refreshToken } = user.getSignedJWTTokens();
	await user.save();

	res.cookie("tempestRefreshToken", refreshToken, {
		httpOnly: true,
		secure: true, // https
		// signed: true,
		sameSite: "none",
		maxAge: process.env.JWT_REFRESH_COOKIE_EXPIRE,
	});

	return res.status(statusCode).json({
		success: true,
		accessToken,
	});
};

export default sendToken;
