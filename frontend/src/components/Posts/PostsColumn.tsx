import { Box } from "@mui/material";
import CreatePost from "./CreatePost";
import FetchedPosts from "./FetchedPosts";

const PostsColumn = () => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "2rem",
				width: { xs: "300px", md: "550px" },
			}}
		>
			<Box
				sx={{
					backgroundColor: "background.paper",
					borderRadius: "0.5rem",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "1rem",
					pt: "1rem",
					position: "relative",
				}}
			>
				<CreatePost />
			</Box>
			<FetchedPosts />
		</Box>
	);
};

export default PostsColumn;
