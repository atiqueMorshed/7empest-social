import { Box, Container } from "@mui/material";
import Connections from "../../components/Connections/Connections";
import PostsColumn from "../../components/Posts/PostsColumn";
import ProfileColumn from "../../components/Profile/ProfileColumn";

const HomePage = () => {
	// const theme = useTheme();
	// const isBelowMd = use
	return (
		<Container maxWidth="xl">
			<Box
				sx={{
					display: "flex",
					gap: 1,
					justifyContent: { xs: "center", md: "space-between" },
					pt: { xs: "5rem", md: "7rem" },
				}}
			>
				<Connections />
				<PostsColumn />
				<ProfileColumn />
			</Box>
		</Container>
	);
};

export default HomePage;
