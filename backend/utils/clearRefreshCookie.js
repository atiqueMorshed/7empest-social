const clearRefreshCookie = (res) => {
	res.clearCookie("tempestRefreshToken", {
		httpOnly: true,
		// signed: true,
		// secure: true, // https
		sameSite: "none",
	});
	res.clearCookie("tempestUserEmail", {
		httpOnly: true,
		// signed: true,
		// secure: true, // https
		sameSite: "none",
	});
};

export default clearRefreshCookie;
