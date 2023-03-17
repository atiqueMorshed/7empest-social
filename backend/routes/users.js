import express from "express";
import {
	addRemoveFollowings,
	findPeople,
	getFollowStatus,
	getFollowers,
	getFollowings,
	getUser,
} from "../controllers/users.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.route("/:username").get(verifyJWT, getUser);
router.route("/:username/followers").get(verifyJWT, getFollowers);
router.route("/:username/followings").get(verifyJWT, getFollowings);
router.route("/followstatus/:username").get(verifyJWT, getFollowStatus);
router.route("/findpeople/:searchTerm/:page").get(verifyJWT, findPeople);

router
	.route("/:followingUsername/follow-unfollow")
	.post(verifyJWT, addRemoveFollowings);

export default router;
