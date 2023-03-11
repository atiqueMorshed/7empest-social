import { Box, Typography } from "@mui/material";

const ErrorPage = () => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
				justifyContent: "center",
				alignItems: "center",
				gap: 2,
			}}
		>
			<Typography
				sx={{
					typography: { xs: "h6", sm: "h4", md: "h2" },
					color: "error.main",
				}}
			>
				There was an unexpected error.
			</Typography>
			<Typography>Please check console for more info.</Typography>
		</Box>
	);
};

export default ErrorPage;
