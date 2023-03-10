import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";

const useAuthPersist = () => {
	const dispatch = useAppDispatch();
	const accessToken = localStorage?.getItem("7empest-social-at");

	useEffect(() => {
		if (accessToken) {
			dispatch(
				setCredentials({
					accessToken: accessToken,
				}),
			);
		}
	}, [accessToken, dispatch]);
};

export default useAuthPersist;
