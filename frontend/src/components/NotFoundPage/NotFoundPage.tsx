import { Box, Typography } from "@mui/material";

const NotFoundPage = () => {
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
					typography: "h1",
					color: "primary.light",
					letterSpacing: 8,
				}}
			>
				404
			</Typography>
			<Typography
				sx={{
					typography: { xs: "h3", sm: "h1" },
					color: "error.main",
					letterSpacing: 8,
				}}
			>
				NOT FOUND
			</Typography>
		</Box>
	);
};

export default NotFoundPage;
