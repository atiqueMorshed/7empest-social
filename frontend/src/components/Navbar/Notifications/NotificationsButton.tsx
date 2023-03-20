import { Notifications } from "@mui/icons-material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
	useGetNotificationsQuery,
	useSetNotificationsSeenMutation,
} from "../../../features/users/usersApi";
import NotificationMenu from "./NotificationMenu";

type iProps = {
	username: string;
};

const NotificationsButton = ({ username }: iProps) => {
	const [hasNewMessage, setHasNewMessage] = useState(false);
	const [anchorElNotification, setAnchorElNotification] =
		useState<null | HTMLElement>(null);

	const { isSuccess, isError, isLoading, data } =
		useGetNotificationsQuery(username);

	const [
		setNotificationsToSeen,
		{
			isLoading: isSetNotificationsToSeenLoading,
			isError: isSetNotificationsToSeenError,
			data: seenData,
		},
	] = useSetNotificationsSeenMutation();

	const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNotification(event.currentTarget);
		if (
			data?.user?.notifications &&
			data.user.notifications?.length > 0 &&
			hasNewMessage === true
		)
			setNotificationsToSeen(username);
	};

	const handleCloseNotificationMenu = () => {
		setAnchorElNotification(null);
	};
	useEffect(() => {
		if (data?.user?.notifications && data.user.notifications?.length > 0) {
			const seenIdx = data.user.notifications.findIndex(
				(notification) => notification.seen === false,
			);
			if (seenIdx === -1) setHasNewMessage(false);
			else setHasNewMessage(true);
		}
	}, [data, seenData]);

	return (
		<>
			<Tooltip title="Recent Notifications">
				<IconButton
					size="small"
					aria-label="Notifications menu Items"
					aria-controls="menu-appbar-notification"
					aria-haspopup="true"
					onClick={handleOpenNotificationMenu}
					color="inherit"
					sx={{
						color: "text.primary",
						backgroundColor: "background.offset2",
						p: 1,
						mr: 1,
						borderRadius: 1,
					}}
				>
					{hasNewMessage ? (
						<NotificationsActiveIcon
							sx={{
								height: { xs: "18px", sm: "24px" },
								width: { xs: "18px", sm: "24px" },
								color: "primary.main",
							}}
						/>
					) : (
						<Notifications
							sx={{
								height: { xs: "18px", sm: "24px" },
								width: { xs: "18px", sm: "24px" },
							}}
						/>
					)}
				</IconButton>
			</Tooltip>
			{/* Notification Menu Dropdown */}
			<NotificationMenu
				anchorElNotification={anchorElNotification}
				handleCloseNotificationMenu={handleCloseNotificationMenu}
				isSuccess={isSuccess}
				isError={isError}
				isLoading={isLoading}
				isSetNotificationsToSeenLoading={isSetNotificationsToSeenLoading}
				isSetNotificationsToSeenError={isSetNotificationsToSeenError}
				data={data}
			/>
		</>
	);
};

export default NotificationsButton;
