import mongoose from "mongoose";

const followerSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	username: String,
	followerFirstName: String,
	followerLastName: String,
	followerUsername: String,
	followerAvatarPath: String,
	followerStanding: String,
	followerLocation: String,
	followerOccupation: String,
	followDate: {
		type: Date,
		default: new Date(),
	},
});

const Follower = mongoose.model("Follower", followerSchema);

export default Follower;
