import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import Navbar from "./components/Navbar/Navbar";
import { themeSettings } from "./components/theme/theme";
import { selectThemeMode } from "./features/theme/themeSlice";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

const App = () => {
	const mode = useAppSelector(selectThemeMode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					backgroundColor: "background.default",
					minHeight: "100vh",
					color: "text.primary",
				}}
			>
				<Navbar />
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/profile/:username" element={<ProfilePage />} />
				</Routes>
			</Box>
		</ThemeProvider>
	);
};

export default App;
