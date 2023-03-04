import express from "express";
import {
	addRemoveFollowers,
	findFollowers,
	findUser,
} from "../controllers/users.js";

const router = express.Router();

router.route("/findUser/:username").get(findUser);
router.route("/findFollowers/:username").get(findFollowers);
router.route("/addRemoveFollowers/:followingUsername").post(addRemoveFollowers);

export default router;
