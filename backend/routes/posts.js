import express from "express";
import uploadFile from "../config/multerDiskStorage.js";
import {
	createPost,
	downvotePost,
	getFeedPosts,
	getUserPosts,
	upvotePost,
} from "../controllers/posts.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.route("/:userId/post").get(verifyJWT, getUserPosts);
// Route with file upload
router
	.route("/")
	.get(verifyJWT, getFeedPosts)
	.post(
		uploadFile.array("post_images", process.env.MAX_POST_IMAGES_COUNT),
		verifyJWT,
		createPost,
	);
router.route("/:postId/upvote").post(verifyJWT, upvotePost);
router.route("/:postId/downvote").post(verifyJWT, downvotePost);

export default router;
