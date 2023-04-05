import { io } from "socket.io-client";
import socketOptions from "../../utils/socketOptions";
import apiSlice from "../api/apiSlice";
import { AuthUserType } from "../auth/auth.types";
import {
	AddRemoveFollowingsType,
	FindPeopleType,
	FollowStatusType,
	NotificationType,
	SearchType,
	UserWithFollowers,
	UserWithFollowings,
	UserWithNotifications,
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
									draft.totalUsers = newUsersResult.data.totalUsers;
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
				url: `/users/${username}/followers/0`,
				method: "GET",
			}),
			providesTags: ["GetFollowers"],

			async onCacheEntryAdded(
				username,
				{ cacheDataLoaded, updateCachedData, cacheEntryRemoved },
			) {
				if (process.env.REACT_APP_BACKEND) {
					const socket = io(
						`http://localhost:4000/follower/${username}`,
						socketOptions,
					);
					try {
						await cacheDataLoaded;
						socket.on(
							"newFollower",
							(data: {
								type: string;
								followedBy: AuthUserType;
								totalFollowers: number;
							}) => {
								updateCachedData((draft) => {
									if (data?.followedBy?._id) {
										const userAtIndex = draft?.user?.followers?.findIndex(
											(user) => user._id == data?.followedBy?._id,
										);
										if (userAtIndex == -1 && data?.type === "FOLLOW")
											draft?.user?.followers?.unshift(data?.followedBy);
										draft.totalFollowers = data.totalFollowers;
										if (
											typeof userAtIndex === "number" &&
											userAtIndex >= 0 &&
											data?.type === "UNFOLLOW"
										)
											draft?.user?.followers?.splice(userAtIndex, 1);
										draft.totalFollowers = data.totalFollowers;
									}
								});
							},
						);
					} catch (error) {
						//
					}
					await cacheEntryRemoved;
					socket.close();
				}
			},
		}),

		getMoreFollowers: builder.query<
			UserWithFollowers,
			{ username: string; page: number }
		>({
			query: ({ username, page }) => ({
				url: `/users/${username}/followers/${page}`,
				method: "GET",
			}),

			async onQueryStarted({ username }, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					// Pessimistic cache update

					if (
						result?.data?.user?.followers &&
						result.data.user.followers?.length > 0
					) {
						dispatch(
							usersApi.util.updateQueryData(
								"getFollowers",
								username,
								(draft) => {
									if (
										draft?.user?.followers &&
										draft.user.followers?.length > 0 &&
										result?.data?.user?.followers &&
										result.data.user.followers?.length > 0
									) {
										draft.user.followers = [
											...draft.user.followers,
											...result.data.user.followers,
										];
										draft.totalFollowers = result.data.totalFollowers;
									}
								},
							),
						);
					}
				} catch (error) {
					// console.log(error);
				}
			},
		}),

		getFollowings: builder.query<UserWithFollowings, string>({
			query: (username) => ({
				url: `/users/${username}/followings/0`,
				method: "GET",
			}),
			providesTags: ["GetFollowings"],
			async onCacheEntryAdded(
				username,
				{ cacheDataLoaded, updateCachedData, cacheEntryRemoved },
			) {
				if (process.env.REACT_APP_BACKEND) {
					const socket = io(
						`http://localhost:4000/follower/${username}`,
						socketOptions,
					);
					try {
						await cacheDataLoaded;
						socket.on(
							"newFollower",
							(data: {
								type: string;
								followedBy: AuthUserType;
								totalFollowers: number;
							}) => {
								updateCachedData((draft) => {
									if (data?.followedBy?._id) {
										const userAtIndex = draft?.user?.followings?.findIndex(
											(user) => user._id == data?.followedBy?._id,
										);
										if (typeof userAtIndex === "number" && userAtIndex >= 0) {
											draft?.user?.followings?.splice(
												userAtIndex,
												1,
												data.followedBy,
											);
										}
									}
								});
							},
						);
					} catch (error) {
						//
					}
					await cacheEntryRemoved;
					socket.close();
				}
			},
		}),

		getMoreFollowings: builder.query<
			UserWithFollowings,
			{ username: string; page: number }
		>({
			query: ({ username, page }) => ({
				url: `/users/${username}/followings/${page}`,
				method: "GET",
			}),

			async onQueryStarted({ username }, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					// Pessimistic cache update
					if (
						result?.data?.user?.followings &&
						result.data.user.followings?.length > 0
					) {
						dispatch(
							usersApi.util.updateQueryData(
								"getFollowings",
								username,
								(draft) => {
									if (
										draft?.user?.followings &&
										draft.user.followings?.length > 0 &&
										result?.data?.user?.followings &&
										result.data.user.followings?.length > 0
									) {
										draft.user.followings = [
											...draft.user.followings,
											...result.data.user.followings,
										];
										draft.totalFollowings = result.data.totalFollowings;
									}
								},
							),
						);
					}
				} catch (error) {
					// console.log(error);
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
				"AuthUser",
				{ type: "FollowStatus", id: arg },
			],
			async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
				try {
					const result = await queryFulfilled;
					if (result?.data?.message) {
						// Update getFollowings endpoint
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
											}
										},
									),
								);
							} else {
								continue;
							}
						}

						// Update getFollowers endpoint
						for (const {
							endpointName,
							originalArgs,
						} of usersApi.util.selectInvalidatedBy(getState(), [
							// eslint-disable-next-line indent
							"GetFollowers",
							// eslint-disable-next-line indent
						])) {
							if (endpointName === "getFollowers") {
								// Update getFollowers Cache
								dispatch(
									usersApi.util.updateQueryData(
										"getFollowers",
										originalArgs,
										(draft) => {
											const userAtIndex = draft?.user?.followers?.findIndex(
												(user) =>
													user.username == result.data.followedUser.username,
											);

											if (typeof userAtIndex === "number" && userAtIndex >= 0) {
												draft?.user?.followers?.splice(
													userAtIndex,
													1,
													result.data.followedUser,
												);
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

		getNotifications: builder.query<UserWithNotifications, string>({
			query: (username) => ({
				url: `/users/${username}/notifications`,
				method: "GET",
			}),
			providesTags: ["GetNotifications"],
			async onCacheEntryAdded(
				username,
				{ cacheDataLoaded, updateCachedData, cacheEntryRemoved },
			) {
				if (process.env.REACT_APP_BACKEND) {
					const socket = io(
						`http://localhost:4000/notifications/${username}`,
						socketOptions,
					);
					try {
						await cacheDataLoaded;
						socket.on("newNotification", (data: NotificationType) => {
							updateCachedData((draft) => {
								if (data?._id) {
									draft?.user?.notifications?.unshift(data);
								}
							});
						});
					} catch (error) {
						//
					}
					await cacheEntryRemoved;
					socket.close();
				}
			},
		}),

		setNotificationsSeen: builder.mutation<{ success: boolean }, string>({
			query: (username) => ({
				url: `/users/${username}/notifications`,
				method: "POST",
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					if (result?.data?.success === true) {
						// Update getNotifications data
						dispatch(
							usersApi.util.updateQueryData(
								"getNotifications",
								arg,
								(draft) => {
									if (
										draft?.user?.notifications &&
										draft.user.notifications?.length > 0
									) {
										draft.user.notifications.map((notification) => {
											notification.seen = true;
										});
									}
								},
							),
						);
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
	useGetNotificationsQuery,
	useSetNotificationsSeenMutation,
} = usersApi;

export default usersApi;
