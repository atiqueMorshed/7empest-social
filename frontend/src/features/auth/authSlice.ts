import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AuthType } from "./auth.types";

const initialState: AuthType = {
	accessToken: undefined,
	success: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			const { accessToken } = action.payload;

			state.accessToken = accessToken;
			state.success = true;

			localStorage.setItem("7empest-social-at", accessToken);
		},
		removeCredentials: (state) => {
			state.accessToken = undefined;
			state.success = false;

			localStorage?.removeItem("7empest-social-at");
		},
	},
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsUserLoggedIn = (state: RootState) => state.auth.success;
