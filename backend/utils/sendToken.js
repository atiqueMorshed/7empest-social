const sendToken = async (res, user, statusCode) => {
	const { accessToken, refreshToken } = user.getSignedJWTRefreshToken();
	await user.save();

	res.cookie("tempestRefreshToken", refreshToken, {
		httpOnly: true,
		// secure: true, // https
		// signed: true,
		sameSite: "none",
		maxAge: process.env.JWT_REFRESH_COOKIE_EXPIRE,
	});
	res.cookie("tempestUserEmail", user.email, {
		httpOnly: true,
		// secure: true, // https
		// signed: true,
		sameSite: "none",
		maxAge: process.env.JWT_REFRESH_COOKIE_EXPIRE,
	});

	const {
		firstname,
		lastname,
		username,
		email,
		isEmailVerified,
		location,
		followerTotal,
		followeeTotal,
		standing,
		joinDate,
	} = user;
	res.status(statusCode).json({
		success: true,
		accessToken,
		user: {
			firstname,
			lastname,
			username,
			email,
			isEmailVerified,
			location,
			followerTotal,
			followeeTotal,
			standing,
			joinDate,
		},
	});
};

export default sendToken;
