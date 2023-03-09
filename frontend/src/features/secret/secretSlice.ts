import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { SuccessMessageType } from "../auth/auth.types";

const initialState: SuccessMessageType = {
	success: false,
	message: "",
};

const secretSlice = createSlice({
	name: "secret",
	initialState,
	reducers: {
		setSecret: (state, action) => {
			state.success = true;
			state.message = action.payload.message;
		},
	},
});

export const { setSecret } = secretSlice.actions;

export default secretSlice.reducer;

export const selectSecret = (state: RootState) => state.secret.message;
