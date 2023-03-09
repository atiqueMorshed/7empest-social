import apiSlice from "../api/apiSlice";
import { SuccessMessageType } from "./auth.types";
import { removeCredentials, setCredentials } from "./authSlice";

const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: "/auth/login",
				method: "POST",
				body: data,
			}),
			async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const result = await queryFulfilled;

					dispatch(
						setCredentials({
							accessToken: result.data.accessToken,
							user: result.data.user,
						}),
					);
				} catch (err) {
					// Will handle error in login UI.
				}
			},
		}),
		logout: builder.mutation<SuccessMessageType, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					console.log(result);
					dispatch(removeCredentials());
					dispatch(apiSlice.util.resetApiState());
				} catch (error) {
					console.log(error);
				}
			},
		}),
	}),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
