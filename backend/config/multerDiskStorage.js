import crypto from "crypto";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `public/assets/${file.fieldname}`);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const fileName =
			crypto.randomBytes(6).toString("hex") + "-" + Date.now() + ext;

		cb(null, fileName);
	},
});

const uploadFile = multer({
	storage,
	limits: {
		fileSize: 2000000, // 2 MB
	},
	fileFilter: function (req, file, cb) {
		if (
			file.mimetype === "image/png" ||
			file.mimetype === "image/jpg" ||
			file.mimetype === "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
		}
	},
});

export default uploadFile;
