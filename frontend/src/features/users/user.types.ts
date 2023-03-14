import * as yup from "yup";
import { AuthUserType } from "../auth/auth.types";

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

export const searchSchema = yup.object({
	searchTerm: yup.string().required(),
	page: yup.number(),
});

export type FindPeopleType = {
	success: boolean;
	users: FindPeopleUserType[];
	totalUsers: number;
};

export type SearchType = yup.InferType<typeof searchSchema>;
