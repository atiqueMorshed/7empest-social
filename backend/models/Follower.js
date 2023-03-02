import mongoose from "mongoose";

const followerSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	username: String,
	followeeFirstName: String,
	followeeLastName: String,
	followeeUsername: String,
	followeeAvatarPath: String,
	followeeStanding: String,
	followDate: Date,
});

const Follower = mongoose.model("Follower", followerSchema);

export default Follower;
