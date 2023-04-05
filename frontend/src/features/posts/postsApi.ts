import apiSlice from "../api/apiSlice";
import { FilterType, PostsReturnType } from "./posts.types";

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
				url: "/posts/",
				method: "GET",
				params: args,
			}),
		}),
	}),
});

export const { useCreatePostMutation, useGetPostsQuery } = postsApi;
