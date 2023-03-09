import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { Avatar, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../features/auth/authApi";

type iProps = {
	anchorElUser: null | HTMLElement;
	handleCloseUserMenu: () => void;
};

const UserMenu = ({ anchorElUser, handleCloseUserMenu }: iProps) => {
	const navigate = useNavigate();

	const [logout, { isError, isSuccess }] = useLogoutMutation();

	useEffect(() => {
		if (isSuccess || isError) navigate("/");
	}, [isSuccess, isError]);

	const handleLogout = () => {
		handleCloseUserMenu();
		logout();
	};

	return (
		<Menu
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
			sx={{ mt: { xs: "45px", sm: "55px" } }}
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
			<MenuItem onClick={handleLogout}>
				<ListItemIcon>
					<Logout fontSize="small" />
				</ListItemIcon>
				Logout
			</MenuItem>
		</Menu>
	);
};

export default UserMenu;
