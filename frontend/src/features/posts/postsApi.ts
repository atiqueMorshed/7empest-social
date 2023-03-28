import apiSlice from "../api/apiSlice";
import { PostsReturnType } from "./posts.types";

const postsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createPost: builder.mutation({
			query: (data) => ({
				url: "/posts/",
				method: "POST",
				body: data,
			}),
		}),
		getPosts: builder.query<PostsReturnType, void>({
			query: () => ({
				url: "/posts",
				method: "GET",
			}),
		}),
	}),
});

export const { useCreatePostMutation, useGetPostsQuery } = postsApi;
