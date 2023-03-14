import { current } from "@reduxjs/toolkit";
import apiSlice from "../api/apiSlice";
import { FindPeopleType, SearchType } from "./user.types";

const usersApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		findUsers: builder.query<FindPeopleType, string>({
			query: (searchTerm) => ({
				url: `/users/findpeople/${searchTerm}/0`,
				method: "GET",
			}),
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
									console.log({
										draft: current(draft.users),
										new: newUsersResult.data.users,
									});
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
	}),
});

export const { useFindUsersQuery } = usersApi;

export default usersApi;
