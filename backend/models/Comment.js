import mongoose from "mongoose";

const commentsSchema = mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	username: String,
	firstname: String,
	lastname: String,
	avatarPath: String,
	standing: String,
	commentedOn: {
		type: Date,
		default: new Date(),
	},
	upvotes: {
		type: Map,
		of: Boolean,
	},
	downvotes: {
		type: Map,
		of: Boolean,
	},
});

const Comment = mongoose.model("Comment", commentsSchema);

export default Comment;
