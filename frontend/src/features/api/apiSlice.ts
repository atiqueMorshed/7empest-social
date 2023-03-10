import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { removeCredentials, setCredentials } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.REACT_APP_BACKEND,
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token =
			(getState() as RootState)?.auth?.accessToken ||
			localStorage.getItem("7empest-social-at");

		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

// @baseQuery params
// auth - request url, method, body
// api - signal, dispatch, getState()
// extraOptions - custom like {shout: true}
const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: async (args, api, extraOptions) => {
		let result = await baseQuery(args, api, extraOptions);
		if (result?.error) {
			const errorMessage = getErrorMessage(result.error);

			// Auth error where error is not because of accessToken expiration
			if (
				errorMessage.startsWith("Auth Error") &&
				result?.error?.status !== 403
			) {
				api.dispatch(removeCredentials());
				return result;

				// Access Token expired
			} else if (result?.error?.status === 403) {
				// Gets new access token from refresh token
				const refreshResult = await baseQuery(
					"/auth/refresh",
					api,
					extraOptions,
				);

				if (refreshResult?.data) {
					api.dispatch(setCredentials({ ...refreshResult.data }));

					// Uses the new accessToken to fetch original request
					result = await baseQuery(args, api, extraOptions);
				} else {
					api.dispatch(removeCredentials());
					// if (refreshResult?.error?.status === 403) {
					// 	// refreshResult?.error?.data?.message = "Your login has expired.";
					// 	api.dispatch(removeCredentials());
					// }
					return refreshResult;
				}
			}
		}

		return result;
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	endpoints: (builder) => ({}),
});

export default apiSlice;
