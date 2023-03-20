import expressAsyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

export const updateAField = expressAsyncHandler(async (req, res) => {
	const updated = await Notification.updateMany({}, { seen: false });
	res.status(200).json({ success: true, updated });
});
