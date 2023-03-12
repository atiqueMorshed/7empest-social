import ErrorResponse from "../utils/ErrorResponse.js";
import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
	origin: (origin, cb) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			cb(null, true);
		} else {
			cb(new ErrorResponse("Not allowed by CORS.", 406));
		}
	},
	credentials: true, // Sets access-control-allow-credentials header.
};

export default corsOptions;
