import apiSlice from "../api/apiSlice";
import { SuccessMessageType } from "../auth/auth.types";

const secretApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSecret: builder.query<SuccessMessageType, void>({
			query: () => ({
				url: "/secret",
				method: "GET",
			}),
		}),
	}),
});

export const { useGetSecretQuery } = secretApi;
