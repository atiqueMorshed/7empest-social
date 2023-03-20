import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useMemo, useRef } from "react";

import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { useAppSelector } from "./app/hooks";
import Navbar from "./components/Navbar/Navbar";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { themeSettings } from "./components/theme/theme";
import { selectUser } from "./features/auth/authSlice";
import { selectThemeMode } from "./features/theme/themeSlice";
import useAuthPersist from "./hooks/useAuthPersist";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import SecretPage from "./pages/SecretPage";
import socketOptions from "./utils/socketOptions";
const App = () => {
	const socket = useRef<any>();

	const mode = useAppSelector(selectThemeMode);
	const user = useAppSelector(selectUser);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	// adds accessToken from localhost to our store.
	useAuthPersist();

	useEffect(() => {
		socket.current = io("http://localhost:4000/connect-status", socketOptions);
	}, []);

	useEffect(() => {
		if (user?._id) {
			// Add to socket online users.
			socket.current.emit("online", user._id);
		}
	}, [user]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{
					backgroundColor: "background.default",
					minHeight: "100vh",
					color: "text.primary",
				}}
			>
				<Navbar />
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<HomePage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/secret"
						element={
							<ProtectedRoute>
								<SecretPage />
							</ProtectedRoute>
						}
					/>
					<Route path="/profile/:username" element={<ProfilePage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Box>
		</ThemeProvider>
	);
};

export default App;
