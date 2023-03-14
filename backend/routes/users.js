import express from "express";
import {
	addRemoveFollowers,
	findPeople,
	getFollowers,
	getFollowings,
	getUser,
} from "../controllers/users.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.route("/findpeople/:searchTerm/:page").get(verifyJWT, findPeople);
router.route("/:username").get(getUser);
router.route("/:username/followers").get(getFollowers);
router.route("/:username/followings").get(getFollowings);
router.route("/:followingUsername/follow-unfollow").post(addRemoveFollowers);

export default router;
