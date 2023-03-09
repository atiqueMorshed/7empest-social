import * as yup from "yup";

export const authUserSchema = yup.object({
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	avatar: yup.string(),
	username: yup.string().required(),
	email: yup.string().required(),
	isEmailVerified: yup.boolean().required(),
	location: yup.string().required(),
	occupation: yup.string().required(),
	standing: yup.string().required(),
	followerTotal: yup.number().required().positive().integer(),
	followingTotal: yup.number().required().positive().integer(),
	joinDate: yup.date().required(),
});

export const authSchema = yup.object({
	accessToken: yup.string().optional(),
	success: yup.boolean().optional(),
});

export const successMessageSchema = yup.object({
	success: yup.boolean().optional(),
	message: yup.string().required(),
});

export type LoginInfoType = {
	email: string;
	password: string;
};

export type AuthType = yup.InferType<typeof authSchema>;
export type AuthUserType = yup.InferType<typeof authUserSchema>;

export type SuccessMessageType = yup.InferType<typeof successMessageSchema>;
