import express from "express";
import uploadFile from "../config/multerDiskStorage.js";
import { createPost, getPosts } from "../controllers/posts.js";
const router = express.Router();

router.route("/getPosts").get(getPosts);

// Route with file upload
router.route("/createPost").post(uploadFile.array("postImage"), createPost);
export default router;
