import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { Avatar, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";

type iProps = {
	anchorElUser: null | HTMLElement;
	handleCloseUserMenu: () => void;
};

const NotificationMenu = ({ anchorElUser, handleCloseUserMenu }: iProps) => {
	return (
		<Menu
			sx={{ mt: "45px" }}
			id="menu-appbar-user"
			anchorEl={anchorElUser}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			open={Boolean(anchorElUser)}
			onClose={handleCloseUserMenu}
		>
			<MenuItem>
				<Avatar sx={{ mr: 1 }} /> Profile
			</MenuItem>
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
