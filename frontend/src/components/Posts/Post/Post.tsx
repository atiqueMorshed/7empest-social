import CategoryIcon from "@mui/icons-material/Category";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import TagIcon from "@mui/icons-material/Tag";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { formatDistance } from "date-fns";
import { useState } from "react";
import ImageGallery from "react-image-gallery";
import { PostType } from "../../../features/posts/posts.types";
import Comments from "./Comments";
type iProps = {
	post: PostType;
};
const Post = ({
	post: {
		_id,
		firstname,
		lastname,
		avatar,
		username,
		title,
		description,
		postImage,
		postedOn,
		privacy,
		category,
		tags,
		upvotes,
		downvotes,
		isUserUpvoted,
		isUserDownvoted,
	},
}: iProps) => {
	const theme = useTheme();
	const [toggleComment, setToggleComment] = useState(false);

	return (
		<Box
			key={_id}
			sx={{
				backgroundColor: "background.paper",
				borderRadius: "0.5rem",
				display: "flex",
				flexDirection: "column",
				alignItems: "start",
				gap: "1rem",
				p: "3rem",
				pb: "1rem",
			}}
		>
			{/* UserInfo */}
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Avatar
					alt="User Image"
					sx={{
						height: "28px",
						width: "28px",
						objectfit: "cover",
						cursor: "pointer",
					}}
					src={`http://localhost:4000/assets/avatar/${avatar}`}
				/>
				<Typography
					variant="body1"
					sx={{
						cursor: "pointer",
						"&:hover": {
							textDecoration: "underline",
						},
						transition: theme.transitions.create(["opacity", "transform"], {
							duration: theme.transitions.duration.standard,
						}),
					}}
				>
					{firstname + " " + lastname}
				</Typography>
				<Typography sx={{ fontSize: "12px", cursor: "pointer" }}>
					@{username}
				</Typography>
				<Typography sx={{ fontSize: "12px", cursor: "pointer" }}>
					|{" "}
					{formatDistance(new Date(postedOn), new Date(), {
						addSuffix: true,
					})}
				</Typography>
			</Box>

			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				{/* Category */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 0.2,
						cursor: "pointer",
						bgcolor: "primary.main",
						px: 1,
						py: 0.3,
						borderRadius: 10,
						"&:hover": {
							opacity: "0.8",
						},
						transition: theme.transitions.create(["opacity", "transform"], {
							duration: theme.transitions.duration.standard,
						}),
					}}
				>
					<CategoryIcon sx={{ fontSize: "12px" }} />
					<Typography variant="body2">{category}</Typography>
				</Box>
				{/* Privacy */}
				<Box
					sx={{
						cursor: "pointer",
						bgcolor: "info.main",
						px: 1,
						py: 0.3,
						borderRadius: 10,
						"&:hover": {
							opacity: "0.8",
						},
						transition: theme.transitions.create(["opacity", "transform"], {
							duration: theme.transitions.duration.standard,
						}),
					}}
				>
					<Typography sx={{ fontSize: "12px" }}>
						{privacy.toUpperCase()}
					</Typography>
				</Box>
			</Box>

			{/* Title */}
			<Typography variant="h4" sx={{ mt: "-0.8rem" }}>
				{title}
			</Typography>

			{/* Tags */}
			{tags && tags?.length > 0 && (
				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "center",
						gap: 0.5,
					}}
				>
					{tags.map((tag) => (
						<Box
							key={tag}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.2,
								cursor: "pointer",
								bgcolor: "background.default",
								px: 1,
								py: 0.3,
								borderRadius: 10,
								"&:hover": {
									opacity: "0.8",
								},
								transition: theme.transitions.create(["opacity", "transform"], {
									duration: theme.transitions.duration.standard,
								}),
								mt: "-0.8rem",
							}}
						>
							<TagIcon sx={{ fontSize: "12px" }} />
							<Typography variant="body2">{tag}</Typography>
						</Box>
					))}
				</Box>
			)}

			{/* Description */}
			{description &&
				description.split("\r\n").map((desc, idx) => (
					<Typography key={idx} variant="body1">
						{desc}
					</Typography>
				))}

			{/* Post Images */}
			{postImage && postImage?.length === 1 && (
				<Box sx={{ width: "full" }}>
					<ImageGallery
						items={[
							{
								original: `http://localhost:4000/assets/post_images/${postImage[0]}`,
							},
						]}
						showNav={false}
						useBrowserFullscreen={false}
						showPlayButton={false}
					/>
				</Box>
			)}
			{postImage && postImage?.length > 1 && (
				<ImageGallery
					items={postImage.map((img) => ({
						original: `http://localhost:4000/assets/post_images/${img}`,
						thumbnail: `http://localhost:4000/assets/post_images/${img}`,
					}))}
					useBrowserFullscreen={false}
					showPlayButton={false}
					showThumbnails={false}
					showBullets={true}
				/>
			)}

			{/* BottomBar */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					pt: "1rem",
					width: "100%",
				}}
			>
				{/* Votes */}
				<Box sx={{ display: "flex", gap: 3 }}>
					{/* upvotes */}
					<Box
						sx={{
							display: "flex",
							gap: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<ThumbUpOutlinedIcon
							sx={{
								cursor: "pointer",
								"&:hover": { color: "primary.main" },
								transition: theme.transitions.create(["color", "transform"], {
									duration: theme.transitions.duration.standard,
								}),
							}}
						/>
						<Typography variant="h6" sx={{ cursor: "default" }}>
							{upvotes}
						</Typography>
					</Box>

					{/* downvotes */}
					<Box
						sx={{
							display: "flex",
							gap: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<ThumbDownAltOutlinedIcon
							sx={{
								cursor: "pointer",
								"&:hover": { color: "primary.main" },
								transition: theme.transitions.create(["color", "transform"], {
									duration: theme.transitions.duration.standard,
								}),
							}}
						/>
						<Typography variant="h6" sx={{ cursor: "default" }}>
							{upvotes}
						</Typography>
					</Box>
				</Box>
				{/* Comment */}

				<IconButton
					onClick={() => setToggleComment((prev) => !prev)}
					sx={{
						cursor: "pointer",
						"&:hover": { color: "primary.main" },
						transition: theme.transitions.create(["color", "transform"], {
							duration: theme.transitions.duration.standard,
						}),
					}}
				>
					{toggleComment ? <ModeCommentIcon /> : <ModeCommentOutlinedIcon />}
				</IconButton>
			</Box>
			{toggleComment && <Comments />}
		</Box>
	);
};

export default Post;
