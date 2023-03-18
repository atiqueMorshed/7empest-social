import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	firstname: String,
	lastname: String,
	username: String,
	avatar: String,
	message: String,
	date: {
		type: Date,
		default: new Date(),
	},
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
