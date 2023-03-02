const sendToken = async (res, user, statusCode) => {
	const { accessToken, refreshToken } = user.getSignedJWTRefreshToken();
	await user.save();

	res.cookie("tempestRefreshToken", refreshToken, {
		httpOnly: true,
		secure: true, // https
		signed: true,
		sameSite: "none",
		maxAge: process.env.JWT_REFRESH_COOKIE_EXPIRE,
	});

	res.status(statusCode).json({ success: true, accessToken });
};

export default sendToken;
