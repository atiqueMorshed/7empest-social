import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	firstname: {
		type: String,
		required: [true, "Firstname is required."],
		minLength: [3, "Must be atleast 3 characters."],
		maxLength: [10, "Cannot be larger than 10 characters."],
		match: [/^[A-Za-z]{6,12}$/, "Only alphabets."],
	},
	lastname: {
		type: String,
		required: [true, "Lastname is required."],
		minLength: [3, "Must be atleast 3 characters."],
		maxLength: [10, "Cannot be larger than 10 characters."],
		match: [/^[A-Za-z]{6,12}$/, "Only alphabets."],
	},
	avatarPath: String,
	username: {
		type: String,
		required: [true, "Username is required."],
		unique: [true, "Username already in use."],
		minLength: [6, "Must be atleast 6 characters."],
		maxLength: [12, "Cannot be larger than 6 characters."],
		match: [/^[A-Za-z0-9]{6,12}$/, "Only alphabets and numbers."],
	},
	email: {
		type: String,
		required: [true, "Email is required."],
		unique: [true, "Email already in use."],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Email must be valid.",
		],
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		minLength: [6, "Must be atleast 6 characters."],
		maxLength: [20, "Cannot be larger than 20 characters."],
		select: false,
	},
	isEmailVerified: Boolean,
	emailVerificationToken: {
		verificationToken: {
			type: String,
			select: false,
		},
		expiryDate: {
			type: Date,
			select: false,
		},
	},
	resetPasswordToken: {
		resetToken: {
			type: Date,
			select: false,
		},
		expiryDate: {
			type: Date,
			select: false,
		},
	},
	location: {
		type: String,
		required: [true, "Password is required"],
		minLength: [2, "Must be atleast 2 characters."],
		maxLength: [20, "Cannot be larger than 20 characters."],
		match: [
			/^[A-Za-z0-9,.\- ]{6,12}$/,
			"Only alphabets, numbers, whitespace, dash, dot, comma",
		],
	},
	occupdation: String,
	device: String,
	ip: String,
	accessLocation: String,
	currentAccessSalt: {
		type: Number,
		default: 0,
	},
	currentRefreshSalt: {
		type: Number,
		default: 0,
	},
	followerTotal: Number,
	followeeTotal: Number,
	followers: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Follower", select: false },
	],
	followees: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Followee", select: false },
	],
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", select: false }],
});
// Here, we are using the function keyword because that will bind the this keyword to the new user object that it receives.
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.matchPasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedJWTAccessToken = function () {
	this.currentAccessSalt = (this.currentAccessSalt + 1) % 100;
	return jwt.sign(
		{ id: this._id, cas: this.currentAccessSalt, crs: this.currentRefreshSalt },
		process.env.JWT_ACCESS_SECRET,
		{
			expiresIn: process.env.JWT_ACCESS_EXPIRE,
		},
	);
};

UserSchema.methods.getSignedJWTRefreshToken = function () {
	this.currentRefreshSalt = (this.currentRefreshSalt + 1) % 1000;
	const refreshToken = jwt.sign(
		{ id: this._id, crs: this.currentRefreshSalt },
		process.env.JWT_REFRESH_SECRET,
		{
			expiresIn: process.env.JWT_REFRESH_EXPIRE,
		},
	);

	this.currentAccessSalt = (this.currentAccessSalt + 1) % 100;
	const accessToken = jwt.sign(
		{ id: this._id, cas: this.currentAccessSalt, crs: this.currentRefreshSalt },
		process.env.JWT_ACCESS_SECRET,
		{
			expiresIn: process.env.JWT_ACCESS_EXPIRE,
		},
	);

	return { accessToken, refreshToken };
};

UserSchema.methods.changeCurrentJWTSalts = function (cas, crs) {
	this.currentAccessSalt = cas + 1;
	this.currentRefreshSalt = crs + 1;
	return true;
};

UserSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");
	this.resetPasswordToken.resetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.resetPasswordToken.expiryDate = new Date(Date.now() + 10 * 60 * 1000);
	return resetToken;
};

const User = mongoose.model("User", UserSchema);

export default User;
