import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import CreatePost from "./CreatePost";
import FetchedPosts from "./FetchedPosts";
import FilterBar from "./FilterBar";

const PostsColumn = () => {
	const [value, setValue] = useState("filter");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "2rem",
				width: { xs: "300px", md: "550px" },
			}}
		>
			<Tabs
				value={value}
				onChange={handleChange}
				textColor="primary"
				indicatorColor="primary"
				aria-label="CreateOrFilter"
			>
				<Tab value="filter" label="Filter" />
				<Tab value="create" label="Create Post" />
			</Tabs>
			{value === "create" && (
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
			)}
			{value === "filter" && <FilterBar />}
			<FetchedPosts />
		</Box>
	);
};

export default PostsColumn;
