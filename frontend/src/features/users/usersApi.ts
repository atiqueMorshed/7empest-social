import { io } from "socket.io-client";
import socketOptions from "../../utils/socketOptions";
import apiSlice from "../api/apiSlice";
import {
	AddRemoveFollowingsType,
	FindPeopleType,
	FollowStatusType,
	SearchType,
	UserWithFollowers,
	UserWithFollowings,
} from "./user.types";

const usersApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		findUsers: builder.query<FindPeopleType, string>({
			query: (searchTerm) => ({
				url: `/users/findpeople/${searchTerm}/0`,
				method: "GET",
			}),
			providesTags: ["FindUsers"],
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

		getFollowers: builder.query<UserWithFollowers, string>({
			query: (username) => ({
				url: `/users/${username}/followers`,
				method: "GET",
			}),
		}),

		getFollowings: builder.query<UserWithFollowings, string>({
			query: (username) => ({
				url: `/users/${username}/followings`,
				method: "GET",
			}),
			providesTags: ["GetFollowings"],
			async onCacheEntryAdded(
				searchTerm,
				{ cacheDataLoaded, updateCachedData, cacheEntryRemoved },
			) {
				if (process.env.REACT_APP_API_URL) {
					const socket = io(process.env.REACT_APP_API_URL, socketOptions);
					try {
						await cacheDataLoaded;
						socket.on("follow", (data) => {
							console.log(data);
						});
					} catch (error) {
						//
					}
				}
			},
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
			async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
				try {
					const result = await queryFulfilled;
					if (result?.data?.message) {
						for (const {
							endpointName,
							originalArgs,
						} of usersApi.util.selectInvalidatedBy(getState(), [
							// eslint-disable-next-line indent
							"GetFollowings",
							// eslint-disable-next-line indent
						])) {
							if (endpointName === "getFollowings") {
								// Update getFollowings Cache
								dispatch(
									usersApi.util.updateQueryData(
										"getFollowings",
										originalArgs,
										(draft) => {
											const userAtIndex = draft?.user?.followings?.findIndex(
												(user) =>
													user.username == result.data.followedUser.username,
											);
											if (
												userAtIndex === -1 &&
												result.data.message.includes("You followed")
											) {
												// Not in the getFollowings's followings list, so we add new.
												draft?.user?.followings?.unshift(
													result.data.followedUser,
												);
											} else if (
												typeof userAtIndex === "number" &&
												result.data.message.includes("You unfollowed")
											) {
												// In the list, so we just replace with new object
												draft?.user?.followings?.splice(userAtIndex, 1);
												// userToUpdate.followerTotal =
												// 	result.data.followedUser.followerTotal;
												// userToUpdate.followingTotal =
												// 	result.data.followedUser.followingTotal;
											}
										},
									),
								);
							} else {
								continue;
							}
						}

						// Update FindUsers Cache
						for (const {
							endpointName,
							originalArgs,
						} of usersApi.util.selectInvalidatedBy(getState(), ["FindUsers"])) {
							if (endpointName === "findUsers") {
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
							} else {
								continue;
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
	useGetFollowingsQuery,
	useGetFollowersQuery,
} = usersApi;

export default usersApi;
