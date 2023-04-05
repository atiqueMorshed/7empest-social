import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { FilterType } from "./posts.types";

const initialState: FilterType = {
	tags: [],
	category: "All",
	privacy: "public",
	sort: "des",
};

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		setFilters: (state, action) => {
			const { tags, category, privacy, sort } = action.payload;
			state.tags = tags?.length > 0 ? tags : [];
			state.category = !category ? "All" : category;
			state.privacy = !privacy ? "public" : privacy;
			state.sort = !sort ? "des" : sort;
		},
	},
});

export const { setFilters } = postsSlice.actions;
export default postsSlice.reducer;

export const selectFilters = (state: RootState) => state.posts;
