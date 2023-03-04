import mongoose from "mongoose";

const followingSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	username: String,
	followingFirstName: String,
	followingLastName: String,
	followingUsername: String,
	followingAvatarPath: String,
	followingStanding: String,
	followingLocation: String,
	followingOccupation: String,
	followDate: {
		type: Date,
		default: new Date(),
	},
});

const Followee = mongoose.model("Following", followingSchema);

export default Followee;
