import * as yup from "yup";
export const avatarSchema = yup.object().shape({
	path: yup.string(),
	lastModified: yup.date(),
	lastModifiedDate: yup.date(),
	name: yup.string(),
	size: yup.number(),
	type: yup.string(),
});

export const registerSchema = yup.object().shape({
	firstname: yup
		.string()
		.min(3, "Atleast 3 characters.")
		.max(10, "Atmost 10 characters.")
		.matches(/^[A-Za-z]{3,10}$/, "Only alphabets.")
		.trim("Leading and trailing whitespace")
		.required("Required"),

	lastname: yup
		.string()
		.min(3, "Atleast 3 characters.")
		.max(10, "Atmost 10 characters.")
		.matches(/^[A-Za-z]{3,10}$/, "Only alphabets.")
		.trim("Leading and trailing whitespace")
		.required("Required"),

	username: yup
		.string()
		.min(6, "Atleast 6 characters.")
		.max(12, "Atmost 12 characters.")
		.matches(/^[A-Za-z0-9]{6,12}$/, "only alphabets and numbers.")
		.trim("Leading and trailing whitespace")
		.required("Required"),

	email: yup
		.string()
		.email("Enter a valid email.")
		.matches(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Must be valid.",
		)
		.trim("Leading and trailing whitespace")
		.required("Required"),

	password: yup
		.string()
		.min(6, "Atleast 6 characters.")
		.trim("Leading and trailing whitespace")
		.required("Required"),

	confirmPassword: yup
		.string()
		.min(6, "Atleast 6 characters.")
		.trim("Leading and trailing whitespace")
		.required("Required"),

	location: yup
		.string()
		.min(2, "Atleast 2 characters.")
		.max(20, "Atmost 20 characters.")
		.trim("Leading and trailing whitespace")
		.matches(
			/^[A-Za-z0-9,.\- ]{2,20}$/,
			"only alphabets, numbers, whitespace, dash, dot, comma",
		)
		.required("Required"),

	occupation: yup
		.string()
		.min(3, "Atleast 3 characters.")
		.max(20, "Atmost 20 characters.")
		.trim("Leading and trailing whitespace")
		.matches(
			/^[A-Za-z0-9,.\- ]{2,20}$/,
			"Only alphabets, numbers, whitespace, dash, dot, comma",
		)
		.required("Required"),
});

export type AvatarType = yup.InferType<typeof avatarSchema>;

export type RegisterType = yup.InferType<typeof registerSchema>;

export const naiveAcceptedFilesTypeCheck = (
	acceptedFiles: unknown,
): acceptedFiles is AvatarType[] => {
	if (
		acceptedFiles &&
		Array.isArray(acceptedFiles) &&
		acceptedFiles.length > 0 &&
		"name" in acceptedFiles[0]
	) {
		return true;
	}
	return false;
};
