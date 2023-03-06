import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import themeSlice from "../features/theme/themeSlice";

export const store = configureStore({
	reducer: {
		auth: authSlice,
		theme: themeSlice,
	},
	devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
