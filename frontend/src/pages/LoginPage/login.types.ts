import * as yup from "yup";

export const loginSchema = yup.object().shape({
	email: yup
		.string()
		.email("Enter a valid email.")
		.required("Email is required."),
	password: yup
		.string()
		.min(6, "Password must be atleast 6 characters.")
		.required("Password is required."),
});

export type LoginType = yup.InferType<typeof loginSchema>;
