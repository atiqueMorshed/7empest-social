import mongoose from "mongoose";

const postSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	username: String,
	firstname: String,
	lastname: String,
	avatarPath: String,
	location: String,
	title: String,
	description: String,
	postImagePath: String,
	upvotes: String,
	downvotes: String,
	category: String,
	tags: [
		{
			type: String,
		},
	],
});

const Post = mongoose.model("Post", postSchema);

export default Post;
