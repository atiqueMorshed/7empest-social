import express from "express";
import { updateAField } from "../controllers/unsafeWARNINGUpdateDB.js";

const router = express.Router();

router.route("/updateAField").post(updateAField);

export default router;
