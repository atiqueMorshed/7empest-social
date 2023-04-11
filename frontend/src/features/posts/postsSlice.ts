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
		addTag: (state, action) => {
			if (!state.tags.includes(action.payload))
				state.tags?.push(action.payload);
		},
		removeTag: (state, action) => {
			state.tags = state.tags.filter((t) => t !== action.payload);
		},

		setCategory: (state, action) => {
			state.category = action.payload;
		},
		setPrivacy: (state, action) => {
			state.privacy = action.payload;
		},
		setSort: (state, action) => {
			state.sort = action.payload;
		},
	},
});

export const {
	setFilters,
	addTag,
	removeTag,
	setCategory,
	setPrivacy,
	setSort,
} = postsSlice.actions;
export default postsSlice.reducer;

export const selectFilters = (state: RootState) => state.posts;
export const selectTags = (state: RootState) => state.posts.tags;
export const selectCategory = (state: RootState) => state.posts.category;
export const selectPrivacy = (state: RootState) => state.posts.privacy;
export const selectSort = (state: RootState) => state.posts.sort;
