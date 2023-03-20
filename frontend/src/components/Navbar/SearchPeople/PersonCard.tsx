import {
	Alert,
	Avatar,
	Box,
	Divider,
	IconButton,
	Link,
	Snackbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { FindPeopleUserType } from "../../../features/users/user.types";

import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
	useAddRemoveFollowingsMutation,
	useGetFollowStatusQuery,
} from "../../../features/users/usersApi";
import { lineClamp1 } from "../../../globalStyles";
import { getErrorMessage } from "../../../utils/getErrorMessage";

type iProps = {
	user: FindPeopleUserType;
	setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
	fromConnection?: boolean;
	isLastIndex?: boolean;
};

const PersonCard = ({
	user: {
		firstname,
		lastname,
		username,
		avatar,
		followerTotal,
		followingTotal,
	},
	setSearchTerm,
	isLastIndex,
}: iProps) => {
	const [open, setOpen] = useState(false);

	const { data } = useGetFollowStatusQuery(username);
	const [
		addRemoveFollowings,
		{ isSuccess, isError, data: addRemoveFollowingsData, error },
	] = useAddRemoveFollowingsMutation();

	useEffect(() => {
		if (isSuccess || isError) setOpen(true);
	}, [isError, isSuccess]);

	useEffect(() => {
		if (isError) console.log(getErrorMessage(error));
	}, [error, isError]);
	const fullname = firstname + " " + lastname;

	// Snackbar S
	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string,
	) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};
	// Snackbar E

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 0,
				}}
			>
				<Box sx={{ position: "relative" }}>
					<RouterLink
						onClick={() => setSearchTerm && setSearchTerm("")}
						to={`/${username}`}
					>
						<Avatar
							alt="User Image"
							sx={{
								height: { xs: "90px", md: "110px" },
								width: { xs: "90px", md: "110px" },
								objectfit: "cover",
								borderRadius: 2,
								mr: { sm: "1rem" },
								gap: 1,
							}}
							src={`http://localhost:4000/assets/avatar/${avatar}`}
						/>
					</RouterLink>
					{/* <Box
						sx={{
							position: "absolute",
							top: { xs: -5, sm: 0 },
							right: { xs: -5, sm: 10 },
						}}
					>
						<Tooltip title={`Standing: ${standing}`}>
							<IconButton>
								<RecommendOutlinedIcon sx={{ color: "primary.light" }} />
							</IconButton>
						</Tooltip>
					</Box> */}
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "space-between",
						gap: 1,
					}}
				>
					<Link
						sx={{ textDecoration: "none", color: "text.primary" }}
						component={RouterLink}
						onClick={() => setSearchTerm && setSearchTerm("")}
						to={`/${username}`}
					>
						<Typography sx={{ pl: 1, ...lineClamp1 }}>
							{fullname.length > 16 ? fullname.slice(0, 11) + ".." : fullname}
						</Typography>
					</Link>
					<Link
						sx={{ textDecoration: "none" }}
						component={RouterLink}
						onClick={() => setSearchTerm && setSearchTerm("")}
						to={`/${username}`}
					>
						<Typography
							sx={{
								fontWeight: 700,
								color: "primary.light",
								pl: 1,
								...lineClamp1,
							}}
						>
							@{username}
						</Typography>
					</Link>

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Tooltip
							title={data?.isFollower ? "You are a follower" : "Followers"}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<IconButton
									onClick={() => addRemoveFollowings(username)}
									sx={{ borderRadius: "5px" }}
								>
									<BookmarkAddOutlinedIcon
										sx={{
											height: 16,
											width: 16,
											color: data?.isFollower
												? "success.main"
												: "primary.light",
											mr: 0.5,
										}}
									/>
									<Typography sx={{ fontSize: 16 }}>{followerTotal}</Typography>
								</IconButton>
							</Box>
						</Tooltip>

						<Tooltip title={data?.isFollowing ? "Following you" : "Following"}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<BookmarkAddedOutlinedIcon
										sx={{
											height: 16,
											width: 16,
											color: data?.isFollowing
												? "success.main"
												: "primary.light",
											mr: 0.5,
										}}
									/>
									<Typography sx={{ fontSize: 16 }}>
										{followingTotal}
									</Typography>
								</Box>
							</Box>
						</Tooltip>
					</Box>
				</Box>
			</Box>
			{!isLastIndex && <Divider sx={{ width: "100%" }} />}
			{isSuccess && (
				<Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
					<Alert
						onClose={handleClose}
						severity={isSuccess ? "success" : "error"}
						sx={{ width: "100%" }}
					>
						{isSuccess && addRemoveFollowingsData?.message}
					</Alert>
				</Snackbar>
			)}
			{isError && (
				<Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
					<Alert
						onClose={handleClose}
						severity={isSuccess ? "success" : "error"}
						sx={{ width: "100%" }}
					>
						{isError && getErrorMessage(error)}
					</Alert>
				</Snackbar>
			)}
		</>
	);
};

export default PersonCard;
