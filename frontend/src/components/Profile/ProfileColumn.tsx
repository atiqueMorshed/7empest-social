import { Box } from "@mui/material";

const ProfileColumn = () => {
	return (
		<Box
			sx={{
				backgroundColor: "background.paper",
				borderRadius: "0.5rem",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "1rem",
				pt: "1rem",
				width: { xs: "300px", md: "400px" },
				height: { xs: "579px", lg: "725px" },
				top: 113 /* sticky needs top positioning to work*/,
				position: "sticky",
			}}
		>
			This is a Profile
		</Box>
	);
};

export default ProfileColumn;
