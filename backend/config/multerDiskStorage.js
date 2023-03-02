import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets");
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const fileName =
			file.originalname.replace(ext, "").toLowerCase().split(" ").join("-") +
			"-" +
			Date.now() +
			Math.floor(Math.random() * 10) +
			Math.floor(Math.random() * 10) +
			ext;
		cb(null, fileName);
	},
});

const uploadFile = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024, // 1 MB
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
