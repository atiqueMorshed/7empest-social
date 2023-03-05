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

// @access Public
// @desc Add or remove follower
// @route /api/users/:followingUsername/follow-unfollow POST
// @req.user username
// @req.params followingUsername
export const addRemoveFollowers = expressAsyncHandler(
	async (req, res, next) => {
		const { username } = req.body;
		const { followingUsername } = req.params;

		const user = await User.findOne({ username }).select(
			"followings followingTotal followingDates",
		);
		if (!user) return next(new ErrorResponse("No user found.", 404));

		const followingUser = await User.findOne({
			username: followingUsername,
		}).select("username followers followerTotal followerDates");
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

		res.status(200).json({ success: true, message, user });
	},
);
