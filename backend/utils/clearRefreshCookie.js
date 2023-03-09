const clearAccessCookie = (res) => {
	res.clearCookie("tempestAccessToken", {
		httpOnly: true,
		// signed: true,
		// secure: true, // https
		sameSite: "none",
	});
};

export default clearAccessCookie;
