import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";

export const updateAField = expressAsyncHandler(async (req, res) => {
	const updated = await User.updateMany({}, { standing: 0 });
	res.status(200).json({ success: true, updated });
});
