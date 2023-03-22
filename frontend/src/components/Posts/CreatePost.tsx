import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
const CreatePost = () => {
	const [toggleExpand, setToggleExpand] = useState(false);

	const handleOpen = () => {
		console.log("Clicked");
		setToggleExpand(true);
	};

	const closeToggle = () => {
		setToggleExpand(false);
	};

	const ref = useDetectClickOutside({ onTriggered: closeToggle });
	const theme = useTheme();
	return (
		<Box
			ref={ref}
			onClick={handleOpen}
			sx={{
				height: toggleExpand ? "10rem" : "5rem",
				transition: theme.transitions.create(["height", "transform"], {
					duration: theme.transitions.duration.standard,
				}),
			}}
		>
			<Typography>XD</Typography>
			<Typography>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, beatae?
			</Typography>
		</Box>
	);
};

export default CreatePost;
