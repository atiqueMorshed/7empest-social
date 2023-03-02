const clearRefreshCookie = (res) => {
	res.clearCookie("tempestRefreshToken", {
		httpOnly: true,
		secure: true, // https
		signed: true,
		sameSite: "none",
	});
};

export default clearRefreshCookie;
