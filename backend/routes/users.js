import express from "express";
import {
	addRemoveFollowers,
	getFollowers,
	getFollowings,
	getUser,
} from "../controllers/users.js";

const router = express.Router();

router.route("/:username").get(getUser);
router.route("/:username/followers").get(getFollowers);
router.route("/:username/followings").get(getFollowings);
router.route("/:followingUsername/follow-unfollow").post(addRemoveFollowers);

export default router;
