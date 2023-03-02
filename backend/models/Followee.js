import mongoose from "mongoose";

const followeeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	username: String,
	followerFirstName: String,
	followerLastName: String,
	followerUsername: String,
	followerAvatarPath: String,
	followerStanding: String,
	followDate: Date,
});

const Follower = mongoose.model("Follower", followeeSchema);

export default Follower;
