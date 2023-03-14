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
			// console.log("IN SET CREDENTIALS");
			const { accessToken } = action.payload;

			state.accessToken = accessToken;
			state.success = true;
			if (accessToken !== localStorage.getItem("7empest-social-at"))
				localStorage.setItem("7empest-social-at", accessToken);
		},
		removeCredentials: (state) => {
			// console.log("IN REMOVE CREDENTIALS");
			state.accessToken = undefined;
			state.success = false;
			state.user = undefined;
			localStorage.removeItem("7empest-social-at");
		},

		setUser: (state, action) => {
			// console.log("IN GET USER");
			state.user = action.payload;
		},
	},
});

export const { setCredentials, removeCredentials, setUser } = authSlice.actions;

export default authSlice.reducer;

export const selectIsUserLoggedIn = (state: RootState) => state.auth.success;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUser = (state: RootState) => state.auth.user;
