import { Typography } from "@mui/material";

type iProps = {
	message?: string;
};
const ErrorMessage = ({ message }: iProps) => {
	return (
		<Typography sx={{ color: "error.main", typography: "h6", pt: 2 }}>
			{message ? message : "There was an error"}
		</Typography>
	);
};

export default ErrorMessage;
