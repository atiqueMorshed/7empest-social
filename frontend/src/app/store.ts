import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import apiSlice from "../features/api/apiSlice";
import authSlice from "../features/auth/authSlice";
import secretSlice from "../features/secret/secretSlice";
import themeSlice from "../features/theme/themeSlice";

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authSlice,
		theme: themeSlice,
		secret: secretSlice,
	},
	devTools: process.env.NODE_ENV !== "production",
	middleware: (getDefaultMiddlewares) =>
		getDefaultMiddlewares().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
