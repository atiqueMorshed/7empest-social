import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
	firstname: {
		type: String,
		required: [true, "Firstname is required."],
		minLength: [3, "Firstname must be atleast 3 characters."],
		maxLength: [10, "Firstname Cannot be larger than 10 characters."],
		match: [/^[A-Za-z]{3,10}$/, "Firstname can only contain alphabets."],
	},
	lastname: {
		type: String,
		required: [true, "Lastname is required."],
		minLength: [3, "Lastname must be atleast 3 characters."],
		maxLength: [10, "Lastname cannot be larger than 10 characters."],
		match: [/^[A-Za-z]{3,10}$/, "Lastname can only contain alphabets."],
	},
	avatar: String,
	username: {
		type: String,
		required: [true, "Username is required."],
		unique: [true, "Username already in use."],
		minLength: [6, "Username must be atleast 6 characters."],
		maxLength: [12, "Username cannot be larger than 12 characters."],
		match: [
			/^[A-Za-z0-9]{6,12}$/,
			"Username can only contain alphabets and numbers.",
		],
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
		minLength: [6, "Password must be atleast 6 characters."],
		select: false,
	},

	location: {
		type: String,
		required: [true, "Location is required"],
		minLength: [2, "Location must be of atleast 2 characters."],
		maxLength: [20, "Location cannot be larger than 20 characters."],
		match: [
			/^[A-Za-z0-9,.\- ]{2,20}$/,
			"Location can only contain alphabets, numbers, whitespace, dash, dot, comma",
		],
	},
	occupation: {
		type: String,
		required: [true, "Occupation is required"],
		minLength: [3, "Occupation must be of atleast 3 characters."],
		maxLength: [20, "Occupation cannot be larger than 20 characters."],
		match: [
			/^[A-Za-z0-9,.\- ]{2,20}$/,
			"Occupation can only contain alphabets, numbers, whitespace, dash, dot, comma",
		],
	},
	standing: {
		type: String,
		default: "respectable",
	},
	device: {
		type: String,
		select: false,
	},
	ip: String,
	accessLocation: {
		type: String,
		select: false,
	},
	currentSalt: {
		type: Number,
		default: 0,
		select: false,
	},

	followerTotal: {
		type: Number,
		default: 0,
	},
	followingTotal: {
		type: Number,
		default: 0,
	},
	followers: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		select: false,
	},
	followings: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		select: false,
	},
	followingDates: {
		type: [
			{
				_id: mongoose.Schema.Types.ObjectId,
				followingFrom: Date,
			},
		],
		select: false,
	},
	followerDates: {
		type: [
			{
				_id: mongoose.Schema.Types.ObjectId,
				followerFrom: Date,
			},
		],
		select: false,
	},
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", select: false }],
	joinDate: {
		type: Date,
		default: new Date(),
	},
	isEmailVerified: {
		type: Boolean,
		default: false,
	},
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
});
// @desc automatically salts our passwords before save (and if they are modified or new);
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

UserSchema.methods.getSignedJWTTokens = function () {
	this.currentSalt = (this.currentSalt + 1) % 100;
	const refreshToken = jwt.sign(
		{ id: this._id, cs: this.currentSalt },
		process.env.JWT_REFRESH_SECRET,
		{
			expiresIn: process.env.JWT_REFRESH_EXPIRE,
		},
	);

	const accessToken = jwt.sign(
		{ id: this._id, cs: this.currentSalt },
		process.env.JWT_ACCESS_SECRET,
		{
			expiresIn: process.env.JWT_ACCESS_EXPIRE,
		},
	);

	return { accessToken, refreshToken };
};

UserSchema.methods.changeCurrentJWTSalt = function (cs) {
	this.currentSalt = cs + 1;
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
