import { Box, CircularProgress } from "@mui/material";

const LoadingPage = () => {
	return (
		<Box
			sx={{
				display: "flex",
				height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
				width: "100vw",
				justifyContent: "center",
				alignItems: "center",
				position: "absolute",
				top: { xs: "56px", sm: "64px" },
				left: 0,
			}}
		>
			<CircularProgress />
		</Box>
	);
};

export default LoadingPage;
