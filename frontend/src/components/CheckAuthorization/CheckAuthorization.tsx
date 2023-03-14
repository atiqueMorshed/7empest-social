import { Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { useCheckAuthorizationQuery } from "../../features/auth/authApi";
import { removeCredentials } from "../../features/auth/authSlice";

type iProps = {
	children: JSX.Element;
};

const CheckAuthorization = ({ children }: iProps) => {
	const dispatch = useAppDispatch();
	const { isLoading, isError, isSuccess, isFetching, error } =
		useCheckAuthorizationQuery();

	if (isLoading || isFetching) return <LoadingPage />;

	if (isError) {
		console.log("CheckAuthorization Error.");
		console.log(error);
		dispatch(removeCredentials());
		return <Navigate to="/login" replace />;
	}

	if (isSuccess) return children;

	return <Typography>No Content</Typography>;
};

export default CheckAuthorization;
