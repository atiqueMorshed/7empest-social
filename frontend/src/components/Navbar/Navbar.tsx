import { DarkMode, LightMode, Login, Search } from "@mui/icons-material";
import { Link, Stack, useMediaQuery, useTheme } from "@mui/material";
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
import { useGetUserQuery } from "../../features/auth/authApi";
import { selectIsUserLoggedIn } from "../../features/auth/authSlice";
import { selectThemeMode, setMode } from "../../features/theme/themeSlice";
import LoadingPage from "../LoadingPage/LoadingPage";
import NotificationsButton from "./Notifications/NotificationsButton";
import SearchMobileMenu from "./SearchMenuMobile";
import SearchPeople from "./SearchPeople/SearchPeople";
import UserMenu from "./UserMenu";

// const pages = ["Profile", "Followers", "Blog"];
const Navbar = () => {
	const [anchorElSearch, setAnchorElSearch] =
		React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null,
	);

	const dispatch = useAppDispatch();
	const mode = useAppSelector(selectThemeMode);

	const theme = useTheme();
	const isBelowSm = useMediaQuery(theme.breakpoints.down("sm"));

	const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
	const { isSuccess, isLoading, data } = useGetUserQuery("getUser", {
		// pollingInterval: 30000,
		skip: !isUserLoggedIn,
	});

	const handleOpenSearchMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElSearch(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseSearchMenu = () => {
		setAnchorElSearch(null);
	};
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	if (isLoading) return <LoadingPage />;

	return (
		<AppBar
			// position="static"
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
						<Link component={RouterLink} to="/" sx={{ textDecoration: "none" }}>
							<Typography
								variant="h6"
								sx={{
									mr: 2,
									display: "flex",
									fontWeight: 900,
									letterSpacing: ".16rem",
									color: "primary.light",
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
								display: { xs: "none", sm: "flex" },
								backgroundColor: "background.offset2",
								borderRadius: 1,
								ml: 3,
								position: "relative",
							}}
						>
							<IconButton size="small">
								<Search />
							</IconButton>
							<SearchPeople />
							{/* <InputBase
								sx={{ pr: 2 }}
								placeholder="Search by name/ username"
							/> */}
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
									mr: { xs: 1 },
								}}
							>
								{mode === "light" ? (
									<DarkMode
										sx={{
											height: { xs: "18px", sm: "24px" },
											width: { xs: "18px", sm: "24px" },
										}}
									/>
								) : (
									<LightMode
										sx={{
											height: { xs: "18px", sm: "24px" },
											width: { xs: "18px", sm: "24px" },
										}}
									/>
								)}
							</IconButton>
						</Tooltip>

						{isSuccess && (
							<>
								{/* Notification Menu Icon */}
								<NotificationsButton username={data.user.username} />
								{/* Mobile Search Menu Icon */}
								<Tooltip title="Search for people">
									<IconButton
										size="small"
										aria-label="Navbar menu Items"
										aria-controls="menu-appbar-nav"
										aria-haspopup="true"
										onClick={handleOpenSearchMenu}
										color="inherit"
										sx={{
											display: {
												xs: "flex",
												sm: "none",
											},
											color: "text.primary",
											backgroundColor: "background.offset2",
											p: 1,
											mr: { xs: 0, sm: 1 },
											borderRadius: 1,
										}}
									>
										<Search
											sx={{
												height: { xs: "18px", sm: "24px" },
												width: { xs: "18px", sm: "24px" },
											}}
										/>
									</IconButton>
								</Tooltip>
							</>
						)}

						{/* User Options Menu Icon */}
						{!isSuccess ? (
							<Tooltip title="Sign In">
								<Link
									component={RouterLink}
									to="/"
									sx={{ textDecoration: "none" }}
								>
									<IconButton
										sx={{
											color: "text.primary",
											backgroundColor: "background.offset2",
											p: 1,
											borderRadius: 1,
											ml: 1,
										}}
									>
										<Stack direction="row" spacing={1} alignItems="center">
											<Login
												sx={{
													height: { xs: "18px", sm: "24px" },
													width: { xs: "18px", sm: "24px" },
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
												Login
											</Typography>
										</Stack>
									</IconButton>
								</Link>
							</Tooltip>
						) : (
							<>
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
												alt="User Image"
												sx={{
													height: { xs: "28px", sm: "34px" },
													width: { xs: "28px", sm: "34px" },
													objectfit: "cover",
												}}
												src={`http://localhost:4000/assets/avatar/${data?.user?.avatar}`}
											/>
											<Typography
												variant="h6"
												sx={{
													display: { xs: "none", md: "flex" },
													color: "text.primary",
													textDecoration: "none",
												}}
											>
												{data?.user?.firstname || "Profile"}
											</Typography>
										</Stack>
									</IconButton>
								</Tooltip>
							</>
						)}

						{/* Search Menu Dropdown */}
						{isSuccess && isBelowSm && (
							<Box
								sx={{
									backgroundColor: "background.offset2",
									borderRadius: 1,
								}}
							>
								<SearchMobileMenu
									anchorElNav={anchorElSearch}
									handleCloseNavMenu={handleCloseSearchMenu}
								/>
							</Box>
						)}
						{/* User Menu Dropdown */}
						{isSuccess && (
							<UserMenu
								anchorElUser={anchorElUser}
								handleCloseUserMenu={handleCloseUserMenu}
							/>
						)}
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default Navbar;
