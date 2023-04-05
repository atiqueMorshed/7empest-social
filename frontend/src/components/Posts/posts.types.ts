import * as yup from "yup";
export const availableCategoryOptions = [
	"Games",
	"Science",
	"Technology",
	"Movies",
	"TV Series",
	"Creative",
	"IRL",
	"Uncategorized",
];
export const tagSchema = yup
	.string()
	.min(3, "Atleast 3 characters.")
	.max(20, "Maximum 20 char per tag.")
	.trim("Leading and trailing whitespace")
	.matches(/^[A-Za-z0-9\-_]+$/, "Only alphanumeric, '-', '_' allowed.")
	.optional();

export const createPostSchema = yup.object({
	title: yup
		.string()
		.min(5, "Atleast 5 characters.")
		.max(300, "Atmost 300 characters.")
		.trim("Leading and trailing whitespace")
		.required(),
	description: yup
		.string()
		.min(3, "Atleast 3 characters.")
		.max(300, "Atmost 300 characters.")
		.trim("Leading and trailing whitespace")
		.optional(),
	privacy: yup.string().required(),
	category: yup.string().required(),
	tags: yup
		.string()
		.min(3, "Atleast 3 characters.")
		.max(50, "Maximum limit reached.")

		.matches(/^[A-Za-z0-9\-_,]+$/, "Only alphanumeric, '-', '_' allowed.")
		.optional(),
});

export type CreatePostType = yup.InferType<typeof createPostSchema>;
