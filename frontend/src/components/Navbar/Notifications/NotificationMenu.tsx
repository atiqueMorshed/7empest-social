import {
	Avatar,
	Box,
	CircularProgress,
	Divider,
	Link,
	Menu,
	MenuItem,
	Stack,
	Typography,
} from "@mui/material";
import { formatDistance } from "date-fns";
import { Link as RouterLink } from "react-router-dom";
import { UserWithNotifications } from "../../../features/users/user.types";
import getMessageFromNotification from "../../../utils/getMessageFromNotification";

type iProps = {
	anchorElNotification: null | HTMLElement;
	handleCloseNotificationMenu: () => void;
	isSuccess: boolean;
	isLoading: boolean;
	isError: boolean;
	isSetNotificationsToSeenLoading: boolean;
	isSetNotificationsToSeenError: boolean;
	data?: UserWithNotifications;
};

const NotificationMenu = ({
	anchorElNotification,
	handleCloseNotificationMenu,
	isSuccess,
	isError,
	isLoading,
	data,
	isSetNotificationsToSeenLoading,
	isSetNotificationsToSeenError,
}: iProps) => {
	let content;
	if (isLoading || isSetNotificationsToSeenLoading) {
		content = (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
					gap: "1rem",
					width: { xs: "100%", sm: "300px" },
					py: "1.5rem",
				}}
			>
				<CircularProgress sx={{ color: "primary.light" }} />
			</Box>
		);
	} else if (isError || isSetNotificationsToSeenError) {
		content = (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
					gap: "1rem",
					width: { xs: "100%", sm: "300px" },
					py: "1.5rem",
				}}
			>
				<Typography variant="h6">Could not get notifications.</Typography>
			</Box>
		);
	} else if (
		isSuccess &&
		data?.user?.notifications &&
		data?.user?.notifications?.length > 0
	) {
		content = data.user.notifications.map((notification, idx) => {
			const { _id, username, message, avatar, date } = notification || {};
			return (
				<Link
					component={RouterLink}
					to={`/${username}`}
					key={_id}
					sx={{ textDecoration: "none" }}
				>
					<MenuItem>
						<Stack
							direction="row"
							spacing={2}
							alignItems="center"
							sx={{ p: "0.5rem" }}
						>
							<Avatar
								alt="User Image"
								sx={{
									height: { xs: "28px", sm: "50px" },
									width: { xs: "28px", sm: "50px" },
									borderRadius: "5px",
									objectfit: "cover",
								}}
								src={`http://localhost:4000/assets/avatar/${avatar}`}
							/>

							<Stack>
								<Typography
									sx={{
										color: "text.primary",
										textDecoration: "none",
										typography: "body2",
									}}
								>
									{username + getMessageFromNotification(message)}
								</Typography>
								<Typography
									sx={{
										color: "text.primary",
										textDecoration: "none",
										fontSize: "12px",
									}}
								>
									{formatDistance(new Date(date), new Date(), {
										addSuffix: true,
									})}
								</Typography>
							</Stack>
						</Stack>
					</MenuItem>
					{data?.user?.notifications &&
						idx !== data.user.notifications.length - 1 && <Divider />}
				</Link>
			);
		});
	} else {
		content = (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
					gap: "1rem",
					width: { xs: "100%", sm: "300px" },
					py: "1.5rem",
				}}
			>
				<Typography variant="h6">No notifications found.</Typography>
			</Box>
		);
	}

	return (
		<Menu
			id="menu-appbar-notification"
			anchorEl={anchorElNotification}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			open={Boolean(anchorElNotification)}
			onClose={handleCloseNotificationMenu}
			sx={{
				mt: { xs: "45px", sm: "55px" },
				maxHeight: "50vh",
			}}
		>
			{content}
		</Menu>
	);
};

export default NotificationMenu;
