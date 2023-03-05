import expressAsyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// @access Private
// @desc Get Posts of a specific user
// @route /api/posts/:userId/posts GET
// @req.user _id
// @req.params userId
export const getUserPosts = expressAsyncHandler(async (req, res, next) => {
	const { userId } = req.params;
	const { _id } = req.user;

	const filter = { userId };
	if (userId !== _id) {
		// The owner is not requesting posts. So, we only return public posts.
		filter.privacy = "public";
	}

	const posts = await Post.find(filter);

	if (!posts) return next(new ErrorResponse("No posts found.", 404));

	res.status(200).json({ posts: posts?.posts || [] });
});

// @access Private
// @desc Get Feed Posts
// @route /api/posts/ GET
// @req.body category, tags, sortBy, sortOrder, followingOnlyPosts
// @req.user _id
export const getFeedPosts = expressAsyncHandler(async (req, res) => {
	const { category, tags, sortBy, sortOrder, followingOnlyPosts } = req.body;
	const { _id } = req.user;

	const filter = { tags: { $in: tags }, privacy: "public" };
	if (category !== "all" || category !== "") filter.category = category;

	if (followingOnlyPosts) {
		// Get Posts Only by people you are following.
		const userFollowingsPosts = await User.findById(_id, "_id").populate(
			"followings",
			"posts",
		);
		const postIds = userFollowingsPosts.followings.map(({ posts }) => posts);

		if (postIds?.length > 0) filter._id = { $in: postIds };
	}

	const posts = await Post.find(filter).sort({ [sortBy]: sortOrder });

	res.status(200).json({ success: true, posts });
});

// @access Private
// @desc Create a Post
// @route /api/posts/ POST
// @req.body _id, title, description, postImagePath, privacy, category, tags
// @req.user _id
export const createPost = expressAsyncHandler(async (req, res, next) => {
	const { title, description, postImagePath, privacy, category, tags } =
		req.body;
	const { _id } = req.user;

	if (!_id) return next(new ErrorResponse("Missing user information.", 404));

	const user = await User.findById(
		_id,
		"username, firstname, lastname, avatarPath, location",
	);

	const post = await Post.create({
		userId: _id,
		username: user.username,
		firstname: user.firstname,
		lastname: user.lastname,
		avatarPath: user.avatarPath,
		location: user.location,
		title,
		description,
		postImagePath,
		privacy,
		category,
		tags,
	});

	if (!post) return next(new ErrorResponse("Post creation failed.", 409));

	user.posts.push(post._id);
	user.save();

	res.status(201).json({ success: true, post });
});

// @access Private
// @desc Upvote a Post
// @route /api/posts/:postId/upvote POST
// @req.user _id
// @req.params postId
export const upvotePost = expressAsyncHandler(async (req, res, next) => {
	const { postId } = req.params;
	const { _id } = req.user;
	const post = await Post.findById(postId);
	if (!post)
		return next(
			new ErrorResponse(
				"Could not complete action because no post was found.",
				404,
			),
		);

	const isUpvoted = post?.upvotes?.get(_id);

	// It's already upvoted, so we remove the upvote
	if (isUpvoted) post.upvotes.delete(_id);
	// It's not upvoted, so we  upvote
	else post.upvotes.set(_id, true);
	const updatedPost = await Post.findByIdAndUpdate(
		postId,
		{ upvotes: post.upvotes },
		{ new: true },
	);

	if (!updatedPost)
		return next(new ErrorResponse("Could not complete action.", 406));

	res.status(200).json({ success: true, updatedPost });
});

// @access Private
// @desc Downvote a Post
// @route /api/posts/:postId/downvote POST
// @req.user _id
// @req.params postId
export const downvotePost = expressAsyncHandler(async (req, res, next) => {
	const { postId } = req.params;
	const { _id } = req.user;
	const post = await Post.findById(postId);
	if (!post)
		return next(
			new ErrorResponse(
				"Could not complete action because no post was found.",
				404,
			),
		);

	const isDownvoted = post?.downvotes?.get(_id);

	// It's already downvoted, so we remove the downvote
	if (isDownvoted) post.downvotes.delete(_id);
	// It's not downvoted, so we  downvote
	else post.upvotes.set(_id, true);

	const updatedPost = await Post.findByIdAndUpdate(
		postId,
		{ downvotes: post.downvotes },
		{ new: true },
	);

	if (!updatedPost)
		return next(new ErrorResponse("Could not complete action.", 406));

	res.status(200).json({ success: true, updatedPost });
});
