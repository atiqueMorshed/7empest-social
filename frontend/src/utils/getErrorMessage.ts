import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export const isFetchBaseQueryError = (
	error: unknown,
): error is FetchBaseQueryError => {
	return typeof error === "object" && error !== null && "status" in error;
};

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export const isErrorWithMessage = (
	error: unknown,
): error is { message: string } => {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		typeof (error as any).message === "string"
	);
};

export const getErrorMessage = (
	error: FetchBaseQueryError | SerializedError | undefined,
) => {
	if (error === undefined) return "Unexpected (Undefined error).";

	// FetchBaseQueryError
	if (isFetchBaseQueryError(error)) {
		if ("error" in error) return error.error;
		else if (error?.data) {
			if (typeof error.data === "string") return error.data;
			else return JSON.stringify(error.data);
		} else return "Unexpected fetch base error.";
	} else {
		// SerializedError
		return error.message || "There was an error.";
	}
};
