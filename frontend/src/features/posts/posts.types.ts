import * as yup from "yup";

export const commentSchema = yup.object({
	_id: yup.string().required(),
	userId: yup.string().required(),
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	avatar: yup.string().optional(),
	username: yup.string().required(),
	comment: yup.string().required(),
	commentedOn: yup.date().required(),
});

export const postSchema = yup.object({
	_id: yup.string().required(),
	userId: yup.string().required(),
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	avatar: yup.string().optional(),
	username: yup.string().required(),
	location: yup.string().required(),
	title: yup.string().required(),
	description: yup.string(),
	postImage: yup.array().of(yup.string()),
	postedOn: yup.date().required(),
	privacy: yup.string().required(),
	category: yup.string().required(),
	tags: yup.array().of(yup.string()),
	upvotes: yup.number().required().positive().integer(),
	downvotes: yup.number().required().positive().integer(),
	isUserUpvoted: yup.boolean(),
	isUserDownvoted: yup.boolean(),
});

export type CommentType = yup.InferType<typeof commentSchema>;
export type CommentsType = CommentType[];

export type PostType = yup.InferType<typeof postSchema>;
export type PostsType = PostType[];

export type PostsReturnType = {
	success: boolean;
	posts: PostsType;
};
