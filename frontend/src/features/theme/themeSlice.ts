import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ThemeType } from "./theme.types";

const initialState: ThemeType = {
	mode: "dark",
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setMode: (state) => {
			state.mode = state.mode === "dark" ? "light" : "dark";
		},
	},
});

export const { setMode } = themeSlice.actions;
export default themeSlice.reducer;

export const selectThemeMode = (state: RootState) => state.theme.mode;
