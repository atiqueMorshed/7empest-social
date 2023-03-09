import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AuthType } from "./auth.types";

const initialState: AuthType = {
	accessToken: undefined,
	success: false,
	user: undefined,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			const { accessToken, user } = action.payload;
			state.accessToken = accessToken;
			state.success = true;
			state.user = user;
		},
		removeCredentials: (state) => {
			state.accessToken = undefined;
			state.user = undefined;
			state.success = false;
		},
	},
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsUserLoggedIn = (state: RootState) => state.auth.success;
