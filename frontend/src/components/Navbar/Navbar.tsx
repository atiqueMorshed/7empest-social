import {
	DarkMode,
	LightMode,
	Notifications,
	Search,
} from "@mui/icons-material";
import { InputBase, Link, Stack, useMediaQuery, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectThemeMode, setMode } from "../../features/theme/themeSlice";
import NavMobileMenu from "./NavMobileMenu";
import NotificationMenu from "./NotificationMenu";
import UserMenu from "./UserMenu";

// const pages = ["Products", "Pricing", "Blog"];

function Navbar() {
	const mode = useAppSelector(selectThemeMode);
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null,
	);
	const [anchorElNotification, setAnchorElNotification] =
		React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null,
	);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNotification(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};
	const handleCloseNotificationMenu = () => {
		setAnchorElNotification(null);
	};
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar
			position="static"
			sx={{ backgroundColor: "background.default", color: "text.primary" }}
		>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Box
						sx={{
							flexGrow: 1,
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<Link
							component={RouterLink}
							to="/home"
							sx={{ textDecoration: "none" }}
						>
							<Typography
								variant="h6"
								sx={{
									mr: 2,
									display: "flex",
									fontWeight: 900,
									letterSpacing: ".16rem",
									color: "inherit",
									textDecoration: "none",
								}}
							>
								7EMPEST
							</Typography>
						</Link>

						{/* <Box sx={{ display: { xs: "none", md: "flex" } }}>
							{pages.map((page) => (
								<Button
									key={page}
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: "text.primary", display: "block" }}
								>
									{page}
								</Button>
							))}
						</Box> */}

						<Box
							sx={{
								display: { xs: "none", md: "flex" },
								backgroundColor: "background.offset2",
								borderRadius: 1,
								ml: 3,
							}}
						>
							<IconButton size="small">
								<Search />
							</IconButton>
							<InputBase
								sx={{ pr: 2 }}
								placeholder="Search by name/ username"
							/>
						</Box>
					</Box>

					<Stack direction="row" alignItems="center">
						{/* Theme Switcher Icon */}
						<Tooltip title="Change Theme">
							<IconButton
								onClick={() => dispatch(setMode())}
								size="small"
								sx={{
									color: "text.primary",
									backgroundColor: "background.offset2",
									p: 1,
									borderRadius: 1,
									mr: { xs: 1, sm: 2 },
								}}
							>
								{mode === "light" ? <DarkMode /> : <LightMode />}
							</IconButton>
						</Tooltip>

						{/* Notification Menu Icon */}
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
									mr: { xs: 0, sm: 1 },
									borderRadius: 1,
								}}
							>
								<Notifications />
							</IconButton>
						</Tooltip>

						{/* Mobile Search Menu Icon */}
						<Tooltip title="Search for people">
							<IconButton
								size="small"
								aria-label="Navbar menu Items"
								aria-controls="menu-appbar-nav"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
								sx={{
									display: {
										xs: "flex",
										md: "none",
									},
									color: "text.primary",
									backgroundColor: "background.offset2",
									p: 1,
									mr: { xs: 0, sm: 1 },
									borderRadius: 1,
								}}
							>
								<Search />
							</IconButton>
						</Tooltip>

						{/* User Options Menu Icon */}
						<Tooltip title="View User Options">
							<IconButton
								aria-label="Navbar User Options"
								aria-controls="menu-appbar-user"
								aria-haspopup="true"
								onClick={handleOpenUserMenu}
								sx={{ py: 0.5, px: 1, borderRadius: 1 }}
							>
								<Stack direction="row" spacing={1} alignItems="center">
									{/* <Avatar
										alt="Full Name"
										sx={{ width: 30, height: 30 }}
										src="/static/images/avatar/2.jpg"
									/> */}
									<Avatar
										alt="Full Name"
										sx={{
											width: { xs: 36, md: 32 },
											height: { xs: 36, md: 32 },
										}}
									/>
									<Typography
										variant="h6"
										sx={{
											display: { xs: "none", md: "flex" },
											color: "text.primary",
											textDecoration: "none",
										}}
									>
										Full Name
									</Typography>
								</Stack>
							</IconButton>
						</Tooltip>

						{/* Notification Menu Dropdown */}
						<NotificationMenu
							anchorElNotification={anchorElNotification}
							handleCloseNotificationMenu={handleCloseNotificationMenu}
						/>
						{/* Search Menu Dropdown */}
						{isBelowMd && (
							<NavMobileMenu
								anchorElNav={anchorElNav}
								handleCloseNavMenu={handleCloseNavMenu}
							/>
						)}
						{/* User Menu Dropdown */}
						<UserMenu
							anchorElUser={anchorElUser}
							handleCloseUserMenu={handleCloseUserMenu}
						/>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default Navbar;
