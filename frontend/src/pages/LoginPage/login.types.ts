import * as yup from "yup";

export const loginSchema = yup.object().shape({
	email: yup
		.string()
		.email("Enter a valid email.")
		.matches(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Must be valid.",
		)
		.trim("Leading and trailing whitespace")
		.required("Email is required."),
	password: yup
		.string()
		.min(6, "Password must be atleast 6 characters.")
		.trim("Leading and trailing whitespace")
		.required("Password is required."),
});

export type LoginType = yup.InferType<typeof loginSchema>;
