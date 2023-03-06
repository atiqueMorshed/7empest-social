import { Search } from "@mui/icons-material";
import { Box, IconButton, InputBase, Menu } from "@mui/material";

type iProps = {
	anchorElNav: null | HTMLElement;
	handleCloseNavMenu: () => void;
};

const NavMobileMenu = ({ anchorElNav, handleCloseNavMenu }: iProps) => {
	return (
		<Menu
			id="menu-appbar-nav"
			anchorEl={anchorElNav}
			anchorOrigin={{
				vertical: "top",
				horizontal: "left",
			}}
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "left",
			}}
			open={Boolean(anchorElNav)}
			onClose={handleCloseNavMenu}
			sx={{
				display: { xs: "block", md: "none" },
				mt: { xs: "45px", sm: "55px" },
			}}
		>
			<Box
				sx={{
					display: { xs: "flex", md: "none" },
					backgroundColor: "background.offset2",
					borderRadius: 1,
					my: 1,
					mx: 2,
					width: "200px",
				}}
			>
				<IconButton size="small">
					<Search />
				</IconButton>
				<InputBase
					sx={{ fontSize: "10px" }}
					placeholder="Search by name/ username"
				/>
			</Box>
		</Menu>
	);
};

export default NavMobileMenu;
