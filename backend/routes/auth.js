import express from "express";
import {
	forgotPassword,
	login,
	refresh,
	register,
	resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);
router.route("/refresh/").get(refresh);

export default router;
