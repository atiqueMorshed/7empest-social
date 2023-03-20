import { Box } from "@mui/material";
import Connections from "../../components/Connections/Connections";

const HomePage = () => {
	return (
		<div>
			<Box
				sx={{
					display: { xs: "block", md: "flex" },
					gap: 1,
					justifyContent: "space-between",
					p: "1rem 5%",
				}}
			>
				<Connections />
			</Box>
		</div>
	);
};

export default HomePage;
