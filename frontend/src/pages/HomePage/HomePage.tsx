import { Box, useMediaQuery, useTheme } from "@mui/material";
import Connections from "../../components/Connections/Connections";

const HomePage = () => {
	const theme = useTheme();
	const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

	return (
		<div>
			<Box
				sx={{
					display: { xs: "block", md: "flex" },
					gap: 1,
					justifyContent: "space-between",
					w: "100%",
					p: "1rem 5%",
				}}
			>
				<Box sx={{ flexBasis: { md: "35%", lg: "25%", xl: "20%" } }}>
					<Connections />
				</Box>
			</Box>
		</div>
	);
};

export default HomePage;
