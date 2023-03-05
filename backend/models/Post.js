import mongoose from "mongoose";

const postSchema = mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	username: String,
	firstname: String,
	lastname: String,
	avatarPath: String,
	location: String,
	title: {
		type: String,
		required: [true, "Post title is required."],
	},
	description: String,
	postImagePath: String,
	postedOn: {
		type: Date,
		default: new Date(),
	},
	privacy: {
		type: String,
		default: "public",
	},
	upvotes: {
		type: Map,
		of: String,
	},
	downvotes: {
		type: Map,
		of: String,
	},
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	category: {
		type: String,
		default: "uncategorized",
	},
	tags: [
		{
			type: String,
			minLength: [3, "Tag must be atleast 3 characters."],
			maxLength: [20, "Tag cannot be larger than 20 characters."],
			match: [
				/^[A-Za-z][A-Za-z0-9\-_]{6,12}$/,
				"Tags must start with an alphabet and can only contain alphanumeric, dash, and underscroll.",
			],
			default: ["untagged"],
		},
	],
});

const Post = mongoose.model("Post", postSchema);

export default Post;
