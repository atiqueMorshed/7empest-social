import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
	Box,
	IconButton,
	MenuItem,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import "react-tagsinput/react-tagsinput.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	addTag,
	removeTag,
	selectCategory,
	selectPrivacy,
	selectSort,
	selectTags,
	setCategory,
	setPrivacy,
	setSort,
} from "../../features/posts/postsSlice";
import { availableCategoryOptions } from "./posts.types";

const FilterBar = () => {
	const tags = useAppSelector(selectTags);
	const category = useAppSelector(selectCategory);
	const privacy = useAppSelector(selectPrivacy);
	const sort = useAppSelector(selectSort);

	const theme = useTheme();
	const dispatch = useAppDispatch();

	const [tag, setTag] = useState<string>("");

	// const [tags, setTags] = useState<string[]>([]);
	// const [privacy, setPrivacy] = useState("");
	// const [category, setCategory] = useState("");
	// const [sort, setSort] = useState("");

	const [tagError, setTagError] = useState("");

	// useEffect(() => {
	// 	dispatch(setFilters({ tags, privacy, category, sort }));
	// }, [tags, privacy, category, sort, dispatch]);

	const handleTags = () => {
		if (tag === "") setTagError("");
		else if (tags.length > 4) {
			setTagError("Maximum 5 tags");
		} else if (tags?.find((t) => t?.toLowerCase() === tag.toLowerCase())) {
			setTagError("Cannot have duplicate tags.");
		} else if (typeof tag === "string" && tag.length > 2) {
			const regex = /^[A-Za-z0-9\-_]{3,20}$/;
			const isMatch = tag.match(regex);
			if (isMatch) {
				setTagError("");
				dispatch(addTag(tag));
				setTag("");
			} else {
				setTagError("Must be between 3-20 chars and only alphanumeric, -, _");
			}
		} else {
			setTagError("Must be between 3-20 chars and only alphanumeric, -, _");
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "start",
				backgroundColor: "background.paper",
				borderRadius: "0.5rem",
				pl: "2rem",
				py: 3.3,
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",

					gap: 2,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					<TextField
						id="tags"
						type="text"
						name="tags"
						label="Tags"
						autoComplete="off"
						error={Boolean(tagError)}
						onChange={(e) => setTag(e.target.value.trim())}
						value={tag}
						size="small"
						sx={{ width: "100px" }}
					/>
					<IconButton onClick={handleTags}>
						<AddIcon
							sx={{
								fontSize: "28px",
								borderRadius: 5,
								bgcolor: "primary.main",
							}}
						/>
					</IconButton>
				</Box>
				<TextField
					id="privacy"
					select
					label="Privacy"
					name="privacy"
					onChange={(e) => dispatch(setPrivacy(e.target.value))}
					value={privacy}
					size="small"
					sx={{ width: "100px" }}
				>
					<MenuItem value="public">Public</MenuItem>
					<MenuItem value="followersOnly">Followers</MenuItem>
				</TextField>
				<TextField
					id="category"
					select
					label="Category"
					name="category"
					onChange={(e) => dispatch(setCategory(e.target.value))}
					value={category}
					size="small"
					sx={{ width: "115px" }}
				>
					{["All", ...availableCategoryOptions].map((cat, idx) => (
						<MenuItem key={idx} value={cat}>
							{cat}
						</MenuItem>
					))}
				</TextField>
				<TextField
					id="sort"
					select
					label="Sort"
					name="sort"
					onChange={(e) => dispatch(setSort(e.target.value))}
					value={sort}
					size="small"
					sx={{ width: "80px" }}
				>
					<MenuItem value="asc">Asc</MenuItem>
					<MenuItem value="des">Des</MenuItem>
				</TextField>
			</Box>
			{tags?.length > 0 && (
				<Box sx={{ display: "flex", justifyContent: "start", gap: 1 }}>
					{tags.map((tag, idx) => (
						<Box
							key={idx}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.2,
								cursor: "pointer",
								bgcolor: "background.default",
								pl: 2,
								borderRadius: 10,
								"&:hover": {
									opacity: "0.8",
								},
								transition: theme.transitions.create(["opacity", "transform"], {
									duration: theme.transitions.duration.standard,
								}),
								mt: 1,
							}}
						>
							<Typography variant="body2">{tag}</Typography>
							<IconButton onClick={() => dispatch(removeTag(tag))}>
								<CloseIcon sx={{ fontSize: "12px" }} />
							</IconButton>
						</Box>
					))}
				</Box>
			)}
			{tagError && (
				<Typography
					sx={{
						fontSize: "12px",
						color: "error.main",

						pt: 1,
					}}
				>
					{tagError}
				</Typography>
			)}
		</Box>
	);
};

export default FilterBar;
