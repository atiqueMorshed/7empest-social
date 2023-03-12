import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import Navbar from "./components/Navbar/Navbar";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { themeSettings } from "./components/theme/theme";
import { selectThemeMode } from "./features/theme/themeSlice";
import useAuthPersist from "./hooks/useAuthPersist";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import SecretPage from "./pages/SecretPage";

const App = () => {
	const mode = useAppSelector(selectThemeMode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	// adds accessToken from localhost to our store.
	useAuthPersist();

	// const { toasts } = useToasterStore();

	// const TOAST_LIMIT = 1;

	// // Enforce Limit
	// useEffect(() => {
	// 	toasts
	// 		.filter((t) => t.visible) // Only consider visible toasts
	// 		.filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
	// 		.forEach((t: { id: string | undefined }) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
	// }, [toasts]);

	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					backgroundColor: "background.default",
					minHeight: "100vh",
					color: "text.primary",
				}}
			>
				<Toaster
					position="top-center"
					reverseOrder={false}
					toastOptions={{
						// Define default options
						duration: 5000,
						style: {
							borderRadius: "5px",
							background: "#333",
							color: "#fff",
						},
					}}
				/>
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
