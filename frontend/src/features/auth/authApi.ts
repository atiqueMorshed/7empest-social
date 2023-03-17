import apiSlice from "../api/apiSlice";
import { AuthGetUserType, AuthType, SuccessMessageType } from "./auth.types";
import { removeCredentials, setCredentials, setUser } from "./authSlice";

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

		register: builder.mutation({
			query: (data) => ({
				url: "/auth/register",
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
					await queryFulfilled;
					dispatch(removeCredentials());
					setTimeout(() => dispatch(apiSlice.util.resetApiState()), 1000);
				} catch (error) {
					dispatch(removeCredentials());
					setTimeout(() => dispatch(apiSlice.util.resetApiState()), 1000);
				}
			},
		}),

		refresh: builder.query<AuthType, void>({
			query: () => ({
				url: "/auth/refresh",
				method: "GET",
			}),
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(setCredentials(result?.data?.accessToken));
				} catch (error) {
					dispatch(removeCredentials());
				}
			},
		}),

		checkAuthorization: builder.query<SuccessMessageType, void>({
			query: () => ({
				url: "/auth/check",
				method: "GET",
			}),
		}),

		getUser: builder.query<AuthGetUserType, string>({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			query: (data) => ({
				url: "/auth/getuser",
				method: "GET",
			}),
			providesTags: [{ type: "AuthUser", id: "CURRENT" }],
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;

					if (result?.data) {
						dispatch(setUser(result.data.user));
					}
				} catch (error) {
					//
					dispatch(removeCredentials());
					console.log("ERR IN GET USER");
					console.log(error);
				}
			},
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useRefreshQuery,
	useCheckAuthorizationQuery,
	useGetUserQuery,
} = authApi;
