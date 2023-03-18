import * as yup from "yup";
import { AuthUserType, authUserSchema } from "../auth/auth.types";

// Schemas
export const userWithFollowersSchema = yup.object({
	success: yup.boolean(),
	user: yup.object({
		_id: yup.string(),
		firstname: yup.string().required(),
		lastname: yup.string().required(),
		avatar: yup.string(),
		username: yup.string().required(),
		email: yup.string().required(),
		isEmailVerified: yup.boolean().required(),
		location: yup.string().required(),
		occupation: yup.string().required(),
		standing: yup.number().required().positive().integer(),
		followerTotal: yup.number().required().positive().integer(),
		followingTotal: yup.number().required().positive().integer(),
		joinDate: yup.date().required(),
		followers: yup.array().of(authUserSchema),
	}),
});
export const userWithFollowingsSchema = yup.object({
	success: yup.boolean(),
	user: yup.object({
		_id: yup.string(),
		firstname: yup.string().required(),
		lastname: yup.string().required(),
		avatar: yup.string(),
		username: yup.string().required(),
		email: yup.string().required(),
		isEmailVerified: yup.boolean().required(),
		location: yup.string().required(),
		occupation: yup.string().required(),
		standing: yup.number().required().positive().integer(),
		followerTotal: yup.number().required().positive().integer(),
		followingTotal: yup.number().required().positive().integer(),
		joinDate: yup.date().required(),
		followings: yup.array().of(authUserSchema),
	}),
});
export const searchSchema = yup.object({
	searchTerm: yup.string().required(),
	page: yup.number(),
});

export const followStatusSchema = yup.object({
	success: yup.boolean(),
	isFollowing: yup.boolean().required(),
	isFollower: yup.boolean().required(),
});

export const addRemoveFollowingsSchema = yup.object({
	success: yup.boolean(),
	message: yup.string().required(),
	currentUser: yup.object({
		_id: yup.string().required(),
		username: yup.string().required(),
		followingTotal: yup.number().required().positive().integer(),
	}),
	followedUser: yup.object({
		_id: yup.string(),
		firstname: yup.string().required(),
		lastname: yup.string().required(),
		avatar: yup.string().optional(),
		username: yup.string().required(),
		email: yup.string().required(),
		isEmailVerified: yup.boolean().required(),
		location: yup.string().required(),
		occupation: yup.string().required(),
		standing: yup.number().required().positive().integer(),
		followerTotal: yup.number().required().positive().integer(),
		followingTotal: yup.number().required().positive().integer(),
		joinDate: yup.date().required(),
	}),
});

// Types
export type FindPeopleUserType = Pick<
	AuthUserType,
	| "_id"
	| "firstname"
	| "lastname"
	| "username"
	| "avatar"
	| "followerTotal"
	| "followingTotal"
	| "standing"
>;

export type FindPeopleType = {
	success: boolean;
	users: FindPeopleUserType[];
	totalUsers: number;
};

export type UserWithFollowers = yup.InferType<typeof userWithFollowersSchema>;
export type UserWithFollowings = yup.InferType<typeof userWithFollowingsSchema>;

export type SearchType = yup.InferType<typeof searchSchema>;

export type FollowStatusType = yup.InferType<typeof followStatusSchema>;

export type AddRemoveFollowingsType = yup.InferType<
	typeof addRemoveFollowingsSchema
>;