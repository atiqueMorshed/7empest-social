const clearRefreshCookie = (res) => {
	res.clearCookie("tempestRefreshToken", {
		httpOnly: true,
		// secure: true, // https
		sameSite: "none",
	});
	res.clearCookie("tempestUserEmail", {
		httpOnly: true,
		// secure: true, // https
		sameSite: "none",
	});
};

export default clearRefreshCookie;
