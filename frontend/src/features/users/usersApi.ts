import apiSlice from "../api/apiSlice";
import {
	AddRemoveFollowingsType,
	FindPeopleType,
	FollowStatusType,
	SearchType,
} from "./user.types";

const usersApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		findUsers: builder.query<FindPeopleType, string>({
			query: (searchTerm) => ({
				url: `/users/findpeople/${searchTerm}/0`,
				method: "GET",
			}),
			providesTags: ["FindUsers"],
			// providesTags: (result, error, args) => {
			// 	if (result?.users && result?.users?.length > 0) {
			// 		return [
			// 			...result.users.map(({ username }) => ({
			// 				type: "FindUsers" as const,
			// 				id: username,
			// 			})),
			// 			{ type: "FindUsers", id: "USERS" },
			// 		];
			// 	} else return [{ type: "FindUsers", id: "USERS" }];
			// },

			// async onQueryStarted(arg, { dispatch, queryFulfilled }) {
			// 	const socket = io(`${process.env.REACT_APP_BACKEND}`, {
			// 		reconnectionDelay: 1000,
			// 		reconnection: true,
			// 		reconnectionAttempts: 10,
			// 		transports: ["websocket"],
			// 		agent: false,
			// 		upgrade: false,
			// 		rejectUnauthorized: false,
			// 	});
			// 	try {
			// 		await queryFulfilled;
			// 		socket.on("socket_users", (socket_users) => {
			// 			console.log(socket_users);
			// 		});
			// 	} catch (error) {
			// 		//
			// 	}
			// },
		}),

		findMoreUsers: builder.query<FindPeopleType, SearchType>({
			query: ({ searchTerm, page }) => ({
				url: `/users/findpeople/${searchTerm}/${page}`,
				method: "GET",
			}),
			// providesTags: (result, error, args) => {
			// 	if (result?.users && result?.users?.length > 0) {
			// 		return [
			// 			...result.users.map(({ username }) => ({
			// 				type: "FindUsers" as const,
			// 				id: username,
			// 			})),
			// 			{ type: "FindUsers", id: "USERS" },
			// 		];
			// 	} else return [{ type: "FindUsers", id: "USERS" }];
			// },

			async onQueryStarted({ searchTerm }, { dispatch, queryFulfilled }) {
				try {
					const newUsersResult = await queryFulfilled;
					// Pessimistic cache update
					if (newUsersResult?.data?.users?.length > 0) {
						dispatch(
							usersApi.util.updateQueryData(
								"findUsers",
								searchTerm,
								(draft) => {
									draft.users = [...draft.users, ...newUsersResult.data.users];
								},
							),
						);
					}
				} catch (error) {
					// console.log(error);
				}
			},
		}),

		getFollowStatus: builder.query<FollowStatusType, string>({
			query: (username) => ({
				url: `/users/followstatus/${username}`,
				method: "GET",
			}),
			providesTags: (result, error, args) => [
				{ type: "FollowStatus", id: args },
			],
		}),

		getFollowers: builder.query<any, string>({
			query: (username) => ({
				url: `/users/${username}/followers`,
				method: "GET",
			}),
		}),

		getFollowings: builder.query<any, string>({
			query: (username) => ({
				url: `/users/${username}/followings`,
				method: "GET",
			}),
		}),

		addRemoveFollowings: builder.mutation<AddRemoveFollowingsType, string>({
			query: (username) => ({
				url: `/users/${username}/follow-unfollow`,
				method: "POST",
			}),
			// Invalidates /auth/getUser, /users/findUsers | findMoreUsers, /users/getFollowStatus
			invalidatesTags: (result, error, arg) => [
				{ type: "AuthUser", id: "CURRENT" },
				// { type: "FindUsers", id: arg },
				{ type: "FollowStatus", id: arg },
			],
			async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
				try {
					const result = await queryFulfilled;
					if (result?.data?.message) {
						for (const {
							endpointName,
							originalArgs,
						} of usersApi.util.selectInvalidatedBy(getState(), ["FindUsers"])) {
							if (endpointName !== "findUsers") continue;
							else {
								dispatch(
									usersApi.util.updateQueryData(
										"findUsers",
										originalArgs,
										(draft) => {
											const userToUpdate = draft?.users?.find(
												(user) =>
													user.username == result.data.followedUser.username,
											);

											if (userToUpdate) {
												userToUpdate.followerTotal =
													result.data.followedUser.followerTotal;
											}
										},
									),
								);
							}
						}
					}
				} catch (error) {
					//
				}
			},
		}),
	}),
});

export const {
	useFindUsersQuery,
	useGetFollowStatusQuery,
	useAddRemoveFollowingsMutation,
} = usersApi;

export default usersApi;
