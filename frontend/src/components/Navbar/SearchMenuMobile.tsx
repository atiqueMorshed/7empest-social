import { Search } from "@mui/icons-material";
import { Box, IconButton, Menu } from "@mui/material";
import SearchPeople from "./SearchPeople/SearchPeople";

type iProps = {
	anchorElNav: null | HTMLElement;
	handleCloseNavMenu: () => void;
};

const SearchMobileMenu = ({ anchorElNav, handleCloseNavMenu }: iProps) => {
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
				mt: { xs: "45px", sm: "55px" },
			}}
		>
			<Box
				sx={{
					backgroundColor: "background.offset2",
					borderRadius: 1,
					my: 1,
					mx: 2,
					width: "250px",
				}}
			>
				<IconButton size="small">
					<Search />
				</IconButton>
				<SearchPeople />
			</Box>
		</Menu>
	);
};

export default SearchMobileMenu;
