import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// @access Public
// @desc Get a user
// @route /api/users/:username GET
// @req.params username
export const getUser = expressAsyncHandler(async (req, res, next) => {
	const { username } = req.params;
	const user = await User.findOne({ username });
	if (!user) return next(new ErrorResponse("No user found.", 404));

	res.status(200).json({ success: true, user });
});

// @access Public
// @desc Get Followers of specified user
// @route /api/users/:username/followers GET
// @req.params username
export const getFollowers = expressAsyncHandler(async (req, res, next) => {
	const { username } = req.params;
	const user = await User.findOne({ username }).populate("followers");
	if (!user) return next(new ErrorResponse("No user found.", 404));

	res.status(200).json({ success: true, user });
});

// @access Public
// @desc Get Followings of specified user
// @route /api/users/:username/followings GET
// @req.params username
export const getFollowings = expressAsyncHandler(async (req, res, next) => {
	const { username } = req.params;
	const user = await User.findOne({ username }, "_id").populate(
		"followings",
		"followers",
	);
	if (!user) return next(new ErrorResponse("No user found.", 404));

	res.status(200).json({ success: true, user });
});

// @access Private
// @desc Find people by search term
// @route /api/findpeople/:searchTerm/:page GET
// @req.params searchTerm page
// @req.userId userId of current user
export const findPeople = expressAsyncHandler(async (req, res, next) => {
	const { searchTerm, page } = req.params;
	if (!searchTerm)
		return res
			.status(404)
			.json({ success: false, message: "No Search Terms." });

	let currPage = 0;
	try {
		currPage = parseInt(page);
	} catch (err) {
		currPage = 0;
	}

	let limit = 5;
	try {
		limit = parseInt(process.env.FIND_PEOPLE_LIMIT_PER_PAGE);
	} catch (error) {
		limit = 5;
	}

	if (searchTerm.trim().length < 2)
		return res.status(406).json({ success: false, message: "Too small." });

	const doubleTerm = searchTerm.split(" ");

	let users;
	let filter = {};
	const select =
		"firstname lastname username avatar standing followerTotal followingTotal";
	const window = { skip: currPage * limit, limit };

	if (doubleTerm && doubleTerm?.length === 2 && doubleTerm[1] !== "") {
		filter = {
			$or: [
				{
					firstname: { $regex: "^" + doubleTerm[0], $options: "i" },
					lastname: { $regex: "^" + doubleTerm[1], $options: "i" },
				},
				{
					firstname: { $regex: "^" + doubleTerm[1], $options: "i" },
					lastname: { $regex: "^" + doubleTerm[0], $options: "i" },
				},
				{
					location: { $regex: searchTerm, $options: "i" },
				},

				{
					occupation: { $regex: searchTerm, $options: "i" },
				},
			],
			_id: { $ne: req?.userId },
		};
	} else {
		filter = {
			$or: [
				{ firstname: { $regex: searchTerm, $options: "i" } },
				{ lastname: { $regex: searchTerm, $options: "i" } },
				{ username: { $regex: searchTerm, $options: "i" } },
				{ email: { $regex: searchTerm, $options: "i" } },
				{ location: { $regex: searchTerm, $options: "i" } },
				{ occupation: { $regex: searchTerm, $options: "i" } },
			],
			_id: { $ne: req?.userId },
		};
	}

	users = await User.find(filter, select, window);

	const totalUsers = await User.find(filter).countDocuments();

	if (!users || users?.length === 0)
		return next(new ErrorResponse("..No user found..", 404));

	// req.io.emit("socket_users", socket_users);

	res.status(200).json({ success: true, users, totalUsers });
});

// @access Private
// @desc Get follow relationships
// @route /api/getfollowstatus/:username GET
// @req.params username
// @req.userId userId of current user
export const getFollowStatus = expressAsyncHandler(async (req, res, next) => {
	const { username } = req.params;

	const user = await User.findOne({ username }, "followers followings");
	if (!user) return next(new ErrorResponse("No user found.", 404));

	const isFollowing =
		user.followings?.find((_id) => _id.equals(req?.userId)) || false;

	const isFollower =
		user.followers?.find((_id) => _id.equals(req?.userId)) || false;

	res
		.status(200)
		.json({ success: true, isFollowing: isFollowing, isFollower: isFollower });
});

// @access Public
// @desc Add or remove follower
// @route /api/users/:followingUsername/follow-unfollow POST
// @req.params followingUsername
export const addRemoveFollowings = expressAsyncHandler(
	async (req, res, next) => {
		const { followingUsername } = req.params;
		if (!req?.userId) {
			new ErrorResponse("Auth Error: Access Denied.", 403);
		}

		const user = await User.findById(
			req.userId,
			"followings followingTotal followingDates",
		);
		if (!user) return next(new ErrorResponse("No user found.", 404));

		const followingUser = await User.findOne(
			{
				username: followingUsername,
			},
			"username followers followerTotal followerDates",
		);
		if (!followingUser) return next(new ErrorResponse("No user found.", 404));

		const isFollowing = user.followings?.find((_id) =>
			_id.equals(followingUser._id),
		);

		// If user is following followingUser
		if (isFollowing) {
			// user stops following followingUser
			user.followings = user.followings.filter(
				(_id) => !_id.equals(followingUser._id),
			);
			user.followingTotal = user.followingTotal - 1;
			user.followingDates = user.followingDates.filter(
				({ _id }) => !_id.equals(followingUser._id),
			);

			// the followingUser loses the user as follower
			followingUser.followers = followingUser.followers.filter(
				(_id) => !_id.equals(user._id),
			);
			followingUser.followerTotal = followingUser.followerTotal - 1;
			followingUser.followerDates = followingUser.followerDates.filter(
				({ _id }) => !_id.equals(user._id),
			);
		}
		// If user is not following followingUser
		else {
			// user follows followingUser.
			user.followings.push(followingUser._id);
			user.followingTotal = user.followingTotal + 1;
			user.followingDates.push({
				_id: followingUser._id,
				followingFrom: new Date(),
			});

			// followingUser gains user as new follower
			followingUser.followers.push(user._id);
			followingUser.followerTotal = followingUser.followerTotal + 1;
			followingUser.followerDates.push({
				_id: user._id,
				followerFrom: new Date(),
			});
		}
		await user.save();
		await followingUser.save();

		const message = isFollowing
			? `You unfollowed ${followingUser.username}.`
			: `You followed ${followingUser.username}.`;

		res.status(200).json({
			success: true,
			message,
			currentUser: {
				_id: user._id,
				username: user.username,
				followingTotal: user.followingTotal,
			},
			followedUser: {
				_id: user._id,
				username: followingUser.username,
				followerTotal: followingUser.followerTotal,
			},
		});
	},
);
