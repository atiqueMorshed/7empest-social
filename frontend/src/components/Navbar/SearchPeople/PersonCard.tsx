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
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
	useAddRemoveFollowingsMutation,
	useGetFollowStatusQuery,
} from "../../../features/users/usersApi";
import { getErrorMessage } from "../../../utils/getErrorMessage";

type iProps = {
	user: FindPeopleUserType;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const PersonCard = ({
	user: {
		firstname,
		lastname,
		username,
		avatar,
		followerTotal,
		followingTotal,
		standing,
	},
	setSearchTerm,
}: iProps) => {
	const fullname = firstname + " " + lastname;
	// Snackbar S
	const [open, setOpen] = useState(false);

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

	const { data } = useGetFollowStatusQuery(username);
	const [
		addRemoveFollowings,
		{ isSuccess, isError, data: addRemoveFollowingsData, error },
	] = useAddRemoveFollowingsMutation();

	useEffect(() => {
		if (isSuccess || isError) setOpen(true);
	}, [isError, isSuccess]);
	// if (isSuccess) {
	// 	return (
	// 		<Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
	// 			<Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
	// 				{addRemoveFollowingsData?.message || "Success"}
	// 			</Alert>
	// 		</Snackbar>
	// 	);
	// }

	// if (isError) {
	// 	return (
	// 		<Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
	// 			<Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
	// 				{getErrorMessage(error)}
	// 			</Alert>
	// 		</Snackbar>
	// 	);
	// }
	useEffect(() => {
		if (isError) console.log(getErrorMessage(error));
	}, [error, isError]);

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<RouterLink onClick={() => setSearchTerm("")} to={`/${username}`}>
					<Avatar
						alt="User Image"
						sx={{
							height: { xs: "90px", md: "110px" },
							width: { xs: "90px", md: "110px" },
							objectfit: "cover",
							borderRadius: 2,
							gap: 1,
						}}
						src={`http://localhost:4000/assets/avatar/${avatar}`}
					/>
				</RouterLink>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "start",
						gap: 0.2,
					}}
				>
					<Link
						sx={{ textDecoration: "none", color: "text.primary" }}
						component={RouterLink}
						onClick={() => setSearchTerm("")}
						to={`/${username}`}
					>
						<Typography sx={{ pl: 1 }}>
							{fullname.length > 16 ? fullname.slice(0, 11) + ".." : fullname}
						</Typography>
					</Link>
					<Link
						sx={{ textDecoration: "none" }}
						component={RouterLink}
						onClick={() => setSearchTerm("")}
						to={`/${username}`}
					>
						<Typography
							sx={{
								fontSize: "14px",
								fontWeight: 700,
								color: "primary.light",
								pl: 1,
							}}
						>
							@{username}
						</Typography>
					</Link>
					<Tooltip title="Standing">
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								gap: 0,
							}}
						>
							<IconButton>
								<StarBorderPurple500OutlinedIcon
									sx={{ height: 16, width: 16, color: "success.main" }}
								/>
							</IconButton>
							<Typography sx={{ fontSize: 13 }}>{standing}</Typography>
						</Box>
					</Tooltip>
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
								<IconButton onClick={() => addRemoveFollowings(username)}>
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
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<IconButton>
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
								</IconButton>
							</Box>
						</Tooltip>
					</Box>
				</Box>
			</Box>
			<Divider sx={{ width: "100%" }} />
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
