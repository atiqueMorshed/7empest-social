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
// @req.params tags, category, privacy, sort
// @req.user _id
export const getFeedPosts = expressAsyncHandler(async (req, res) => {
	const { tags, category, privacy, sort } = req.query;
	console.log(req.query);
	const { page } = req.params;

	let currPage = 0;
	try {
		currPage = parseInt(page);
	} catch (err) {
		currPage = 0;
	}

	let limit = 5;
	try {
		limit = parseInt(process.env.POSTS_LIMIT_PER_PAGE);
	} catch (error) {
		limit = 5;
	}

	const filter = {
		privacy: {
			$in: ["public"],
		},
	};
	if (tags?.length > 0) {
		const tagsArray = tags.split(",");
		filter.tags = { $in: tagsArray };
	}

	const sortDate = { postedOn: sort === "asc" ? 1 : -1 };

	if (category && category !== "All") filter.category = category;

	if (privacy === "followersOnly") {
		// Get Posts Only by people you are following.
		filter.privacy = {
			$in: ["public", "followersOnly"],
		};
		const userFollowingsPosts = await User.findById(req.userId, "_id").populate(
			"followings",
			"posts",
		);
		let postIds = [];
		userFollowingsPosts.followings?.forEach(({ posts }) => {
			if (posts?.length > 0) postIds.push(...posts);
		});

		if (postIds?.length > 0) filter._id = { $in: postIds };
	}

	// console.log(filter);
	// console.log(sortDate);

	const posts = await Post.find(filter)
		.limit(limit)
		.skip(currPage * limit)
		.sort(sortDate);

	const totalPosts = await Post.count(filter);

	console.log({ currPage, limit, totalPosts });

	res.status(200).json({ success: true, posts, totalPosts });
});

// @access Private
// @desc Create a Post
// @route /api/posts/ POST
// @req.body _id, title, description, postImagePath, privacy, category, tags
// @req.user _id
export const createPost = expressAsyncHandler(async (req, res, next) => {
	const { _id, title, description, privacy, category, tags } = req.body;

	let tagArray;
	if (tags?.length > 2) {
		tagArray = tags?.split(",");
		tagArray = tagArray.map((t) => t.replaceAll(/[, ]/g, ""));
		tagArray = tagArray.filter((t) => t.length > 2);
	}

	if (!_id) return next(new ErrorResponse("Missing user information.", 404));
	if (!title || !privacy || !category)
		return next(new ErrorResponse("Required content missing.", 404));

	let files = [];
	if (req?.files?.length > 0) {
		files = req.files.map((file) => file.filename);
	}

	const user = await User.findById(
		_id,
		"username firstname lastname avatar location posts",
	);

	const post = await Post.create({
		userId: _id,
		username: user.username,
		firstname: user.firstname,
		lastname: user.lastname,
		avatar: user.avatar,
		location: user.location,
		title,
		description,
		postImage: files,
		privacy,
		category,
		tags: tagArray,
	});

	if (!post) return next(new ErrorResponse("Post creation failed.", 409));

	user.posts.push(post._id);
	user.save();

	req.io.of("/newpost").emit("newPost", post);

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
