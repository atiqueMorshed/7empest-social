import mongoose from "mongoose";

const connectDB = () => {
	try {
		mongoose.set("strictQuery", false);
		mongoose.connect(process.env.MONGO_URI_DOCKER);
		console.log("MongoDB database connected!");
	} catch (err) {
		console.error("ERROR: ", err.message);
	}
};

export default connectDB;
