import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectIsUserLoggedIn } from "../features/auth/authSlice";
import { useGetSecretQuery } from "../features/secret/secretApi";
import { getErrorMessage } from "../utils/getErrorMessage";

const SecretPage = () => {
	const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isUserLoggedIn) navigate("/", { state: { from: "/secret" } });
	}, [navigate, isUserLoggedIn]);

	const { isError, isSuccess, isLoading, data, error } = useGetSecretQuery();
	let content = <Typography>Initial...</Typography>;
	if (isLoading) content = <Typography>Loading...</Typography>;
	if (isError)
		content = <Typography>Error - {getErrorMessage(error)}</Typography>;
	if (isSuccess) content = <Typography>Success - {data?.message}</Typography>;

	return content;
};

export default SecretPage;
