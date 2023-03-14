import {
	Avatar,
	Box,
	Divider,
	IconButton,
	Link,
	Tooltip,
	Typography,
} from "@mui/material";
import { FindPeopleUserType } from "../../../features/users/user.types";

import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import { Link as RouterLink } from "react-router-dom";

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
						<Tooltip title="Followers">
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<IconButton>
									<BookmarkAddOutlinedIcon
										sx={{ height: 16, width: 16, color: "primary.light" }}
									/>
								</IconButton>
								<Typography sx={{ fontSize: 16 }}>{followerTotal}</Typography>
							</Box>
						</Tooltip>

						<Tooltip title="Following">
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<IconButton>
									<BookmarkAddedOutlinedIcon
										sx={{ height: 16, width: 16, color: "success.main" }}
									/>
								</IconButton>
								<Typography sx={{ fontSize: 16 }}>{followingTotal}</Typography>
							</Box>
						</Tooltip>
					</Box>
				</Box>
			</Box>
			<Divider sx={{ width: "100%" }} />
		</>
	);
};

export default PersonCard;
