import { ThemeProvider, createTheme } from "@mui/material";
import { useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { themeSettings } from "./components/theme/theme";
import { selectThemeMode, setMode } from "./features/theme/themeSlice";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

const App = () => {
	const mode = useAppSelector(selectThemeMode);
	console.log(mode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	const dispatch = useAppDispatch();
	return (
		<div className="app">
			<ThemeProvider theme={theme}>
				<button onClick={() => dispatch(setMode())}>Switch</button>
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
