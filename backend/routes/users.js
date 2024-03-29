import express from "express";
import {
	addRemoveFollowings,
	findPeople,
	getFollowStatus,
	getFollowers,
	getFollowings,
	getNotifications,
	getUser,
	setNotificationsToSeen,
} from "../controllers/users.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.route("/:username").get(verifyJWT, getUser);
router.route("/:username/followers/:page").get(verifyJWT, getFollowers);
router.route("/:username/followings/:page").get(verifyJWT, getFollowings);
router
	.route("/:username/notifications")
	.get(getNotifications)
	.post(setNotificationsToSeen);
router.route("/followstatus/:username").get(verifyJWT, getFollowStatus);
router.route("/findpeople/:searchTerm/:page").get(verifyJWT, findPeople);

router
	.route("/:followingUsername/follow-unfollow")
	.post(verifyJWT, addRemoveFollowings);

export default router;
