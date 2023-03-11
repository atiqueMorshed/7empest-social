import { Typography } from "@mui/material";
import { useGetSecretQuery } from "../features/secret/secretApi";
import { getErrorMessage } from "../utils/getErrorMessage";

const SecretPage = () => {
	const { isError, isSuccess, isLoading, data, error } = useGetSecretQuery();

	let content = <Typography>Initial...</Typography>;

	if (isLoading) content = <Typography>Loading...</Typography>;

	if (isError)
		content = <Typography>Error - {getErrorMessage(error)}</Typography>;

	if (isSuccess) content = <Typography>Success - {data?.message}</Typography>;

	return content;
};

export default SecretPage;
