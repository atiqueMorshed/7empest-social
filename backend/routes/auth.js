import express from "express";
import uploadFile from "../config/multerDiskStorage.js";
import {
	forgotPassword,
	login,
	refresh,
	register,
	resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);
router.route("/refresh/").get(refresh);

// Route with file upload
router.route("/register").post(uploadFile.single("avatar"), register);
export default router;
