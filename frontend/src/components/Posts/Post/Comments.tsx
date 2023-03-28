import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { formatDistance } from "date-fns";
import { useState } from "react";
import ShowMoreText from "react-show-more-text";

const Comments = () => {
	const theme = useTheme();
	const [expand, setExpand] = useState(false);
	return (
		<Box sx={{ maxHeight: "400px", overflow: "scroll" }}>
			{[1, 2, 3, 4, 5].map((comment, idx) => (
				<Box
					key={idx}
					sx={{
						display: "flex",
						gap: 2,
						justifyContent: "start",
						alignItems: "start",
						mt: 2.5,
					}}
				>
					<Avatar
						alt="User Image"
						sx={{
							height: "36px",
							width: "36px",
							objectfit: "cover",
							cursor: "pointer",
						}}
						// src={`http://localhost:4000/assets/avatar/${avatar}`}
					/>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 1,
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Typography
								variant="body1"
								sx={{
									cursor: "pointer",
									color: "primary.light",
									"&:hover": {
										textDecoration: "underline",
									},
									transition: theme.transitions.create(
										["opacity", "transform"],
										{
											duration: theme.transitions.duration.standard,
										},
									),
								}}
							>
								Full Name
							</Typography>
							<Typography sx={{ fontSize: "12px", cursor: "pointer" }}>
								@username
							</Typography>
							<Typography sx={{ fontSize: "12px", cursor: "pointer" }}>
								|{" "}
								{formatDistance(new Date(), new Date(), {
									addSuffix: true,
								})}
							</Typography>
						</Box>
						<ShowMoreText
							lines={2}
							more={"more"}
							less={"less"}
							onClick={() => setExpand((prev) => !prev)}
							expanded={expand}
						>
							<Typography
								variant="body2"
								sx={{
									cursor: "default",
								}}
							>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
								aliquid consequuntur maxime rem aspernatur, recusandae saepe
								porro corporis ipsam vel voluptas blanditiis nemo, molestias
								fugiat, facere delectus unde assumenda consectetur explicabo
								corrupti velit quos.
							</Typography>
						</ShowMoreText>
					</Box>
				</Box>
			))}
		</Box>
	);
};

export default Comments;
