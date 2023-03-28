import { Box, CircularProgress, Typography } from "@mui/material";

import { useGetPostsQuery } from "../../features/posts/postsApi";
import Post from "./Post/Post";

const FetchedPosts = () => {
	const { isSuccess, isLoading, data } = useGetPostsQuery();

	let content;
	if (isLoading) {
		content = (
			<Box
				sx={{
					backgroundColor: "background.paper",
					borderRadius: "0.5rem",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					p: "3rem",
				}}
			>
				<CircularProgress sx={{ color: "primary.light" }} />
			</Box>
		);
	} else if (isSuccess && data?.posts && data?.posts?.length > 0) {
		content = (
			<>
				{data.posts.map((post) => (
					<Post key={post._id} post={post} />
				))}
			</>
		);
	} else {
		content = (
			<Box
				sx={{
					backgroundColor: "background.paper",
					borderRadius: "0.5rem",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					p: "3rem",
				}}
			>
				<Typography variant="h4">No posts found.</Typography>
			</Box>
		);
	}

	return content;
};

export default FetchedPosts;