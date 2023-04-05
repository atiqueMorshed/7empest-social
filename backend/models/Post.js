import mongoose from "mongoose";

const postSchema = mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	firstname: String,
	lastname: String,
	avatar: String,
	username: String,
	location: String,
	title: {
		type: String,
		required: [true, "Post title is required."],
	},
	description: String,
	postImage: [
		{
			type: String,
		},
	],
	postedOn: {
		type: Date,
		default: new Date(),
	},
	privacy: {
		type: String,
		default: "public",
	},

	category: {
		type: String,
		default: "uncategorized",
	},
	tags: [
		{
			type: String,
			minLength: [3, "Tag must be atleast 3 characters."],
			maxLength: [20, "Tag must be atmost 20 characters"],
		},
	],
	upvotes: {
		type: Number,
		default: 0,
	},
	downvotes: {
		type: Number,
		default: 0,
	},
	upvotedBy: {
		type: Map,
		of: mongoose.Schema.Types.ObjectId,
	},
	downvotedBy: {
		type: Map,
		of: String,
	},
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Post = mongoose.model("Post", postSchema);

export default Post;
