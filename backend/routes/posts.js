import express from "express";
import uploadFile from "../config/multerDiskStorage.js";
import {
	createPost,
	downvotePost,
	getFeedPosts,
	getUserPosts,
	upvotePost,
} from "../controllers/posts.js";
const router = express.Router();

router.route("/").get(getFeedPosts).post(
	uploadFile.array("post_images", process.env.MAX_POST_IMAGES_COUNT), // Route with file upload
	createPost,
);
router.route("/:userId/posts").get(getUserPosts);

router.route("/:postId/upvote").post(upvotePost);
router.route("/:postId/downvote").post(downvotePost);
export default router;
