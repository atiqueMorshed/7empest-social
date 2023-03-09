const extractJWTFromAuthorizationHeader = (req) => {
	const authHeader = req.headers?.Authorization || req.headers?.authorization;
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
	return accessToken;
};

export default extractJWTFromAuthorizationHeader;
