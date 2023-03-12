import express from "express";
import uploadFile from "../config/multerDiskStorage.js";
import {
	checkAuthorization,
	forgotPassword,
	getUser,
	login,
	logout,
	refresh,
	register,
	resetPassword,
} from "../controllers/auth.js";
import { loginLimiter } from "../middleware/requestLimiter.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.route("/login").post(loginLimiter, login);
router.route("/logout").post(logout);
router.route("/forgotpassword").post(loginLimiter, forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);
router.route("/refresh/").get(refresh);
router.route("/check").get(verifyJWT, checkAuthorization);
router.route("/getuser").get(verifyJWT, getUser);

// Route with file upload
router.route("/register").post(uploadFile.single("avatar"), register);
export default router;
