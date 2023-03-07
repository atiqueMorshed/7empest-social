import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import {
	Avatar,
	Divider,
	ListItemIcon,
	Menu,
	MenuItem,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";

type iProps = {
	anchorElNotification: null | HTMLElement;
	handleCloseNotificationMenu: () => void;
};
const msg =
	"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis obcaecati accusamus ea commodi autem accusantium mollitia. Tenetur, necessitatibus ex magnam quibusdam rerum dolor. Velit iste corrupti nostrum dicta voluptatem earum?";
const NotificationMenu = ({
	anchorElNotification,
	handleCloseNotificationMenu,
}: iProps) => {
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
			sx={{ mt: { xs: "45px", sm: "55px" } }}
		>
			<MenuItem>
				<Tooltip title="New Message" placement="bottom-end">
					<Stack direction="row" spacing={1} alignItems="center">
						<Avatar
							sx={{
								width: { xs: "50px", sm: "64px" },
								height: { xs: "50px", sm: "64px" },
								mr: 1,
							}}
							alt="Full Name"
						/>

						<Stack>
							<Typography
								variant="h6"
								sx={{
									color: "primary.light",
									fontWeight: 700,
									textDecoration: "none",
								}}
							>
								Abdul Bari
							</Typography>
							<Typography
								sx={{
									color: "text.primary",
									textDecoration: "none",
									typography: { xs: "body2", sm: "body2" },
								}}
							>
								{msg?.length > 20 ? msg.slice(0, 20) + " ..." : msg}
							</Typography>
						</Stack>
					</Stack>
				</Tooltip>
			</MenuItem>
			<Divider />
			<MenuItem>
				<Avatar sx={{ mr: 1 }} /> My account
			</MenuItem>
			<Divider />
			<MenuItem>
				<ListItemIcon>
					<PersonAdd fontSize="small" />
				</ListItemIcon>
				Add another account
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<Settings fontSize="small" />
				</ListItemIcon>
				Settings
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<Logout fontSize="small" />
				</ListItemIcon>
				Logout
			</MenuItem>
		</Menu>
	);
};

export default NotificationMenu;
