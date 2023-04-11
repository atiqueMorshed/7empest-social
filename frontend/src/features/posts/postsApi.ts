import { io } from "socket.io-client";
import socketOptions from "../../utils/socketOptions";
import apiSlice from "../api/apiSlice";
import { FilterType, PostType, PostsReturnType } from "./posts.types";

const postsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createPost: builder.mutation({
			query: (data) => ({
				url: "/posts/",
				method: "POST",
				body: data,
			}),
		}),
		getPosts: builder.query<PostsReturnType, FilterType>({
			query: (args) => ({
				// args = {tags, privacy, category, sort}
				url: "/posts/0",
				method: "GET",
				params: args,
			}),
			providesTags: ["GetPosts"],

			async onCacheEntryAdded(
				{ sort, category, tags },
				{ cacheDataLoaded, updateCachedData, cacheEntryRemoved },
			) {
				if (process.env.REACT_APP_BACKEND) {
					const socket = io("http://localhost:4000/newpost", socketOptions);
					try {
						await cacheDataLoaded;
						socket.on("newPost", (data: PostType) => {
							console.log(data);
							updateCachedData((draft) => {
								let flag = true;
								if (category && category.length > 0 && category !== "All") {
									if (category !== data.category) flag = false;
								}
								if (tags && tags?.length > 0) {
									if (data?.tags && data.tags?.length === 0) flag = false;
									else if (
										data?.tags &&
										data.tags?.length > 0 &&
										data.tags.every((elem) => tags.includes(elem))
									)
										flag = true;
									else flag = false;
								}
								if (flag === true) {
									if (sort === "asc") {
										draft.posts = [...draft.posts, data];
										draft.totalPosts = Number(draft.totalPosts) + 1;
									} else {
										draft.posts = [data, ...draft.posts];
										draft.totalPosts = Number(draft.totalPosts) + 1;
									}
								}
								// if (data?.tags && data.tags?.length > 0 && data.tags.every) {
								// 	const userAtIndex = draft?.user?.followers?.findIndex(
								// 		(user) => user._id == data?.followedBy?._id,
								// 	);
								// 	if (userAtIndex == -1 && data?.type === "FOLLOW")
								// 		draft?.user?.followers?.unshift(data?.followedBy);
								// 	draft.totalFollowers = data.totalFollowers;
								// 	if (
								// 		typeof userAtIndex === "number" &&
								// 		userAtIndex >= 0 &&
								// 		data?.type === "UNFOLLOW"
								// 	)
								// 		draft?.user?.followers?.splice(userAtIndex, 1);
								// 	draft.totalFollowers = data.totalFollowers;
								// }
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
		getMorePosts: builder.query<PostsReturnType, FilterType>({
			query: ({ page, ...rest }) => ({
				// args = {tags, privacy, category, sort}
				url: `/posts/${page}`,
				method: "GET",
				params: rest,
			}),
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			async onQueryStarted({ page, ...rest }, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;

					if (result?.data?.posts && result?.data?.posts?.length > 0) {
						dispatch(
							postsApi.util.updateQueryData("getPosts", rest, (draft) => {
								if (
									draft?.posts &&
									draft?.posts?.length > 0 &&
									result?.data?.posts &&
									result?.data?.posts?.length > 0
								) {
									draft.posts = [...draft.posts, ...result.data.posts];
									draft.totalPosts = result.data.totalPosts;
								}
							}),
						);
					}
				} catch (error) {
					//
				}
			},
		}),
	}),
});

export const { useCreatePostMutation, useGetPostsQuery } = postsApi;

export default postsApi;
