import * as yup from "yup";
import { AuthUserType } from "../auth/auth.types";

// Schemas
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
		_id: yup.string().required(),
		username: yup.string().required(),
		followerTotal: yup.number().required().positive().integer(),
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

export type SearchType = yup.InferType<typeof searchSchema>;

export type FollowStatusType = yup.InferType<typeof followStatusSchema>;

export type AddRemoveFollowingsType = yup.InferType<
	typeof addRemoveFollowingsSchema
>;
