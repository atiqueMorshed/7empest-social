import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { themeSettings } from "./components/theme/theme";
import { selectThemeMode } from "./features/theme/themeSlice";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

const App = () => {
	const mode = useAppSelector(selectThemeMode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

	return (
		<div className="app">
			<ThemeProvider theme={theme}>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/profile/:username" element={<ProfilePage />} />
				</Routes>
			</ThemeProvider>
		</div>
	);
};

export default App;
