import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AuthType } from "./auth.types";

const initialState: AuthType = {
	accessToken: undefined,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			const { accessToken } = action.payload;
			state.accessToken = accessToken;
		},
		logOut: (state) => {
			state.accessToken = undefined;
		},
	},
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
