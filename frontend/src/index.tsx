import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./app/store";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import "./index.css";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<React.StrictMode>
		<ErrorBoundary fallback={<ErrorPage />}>
			<BrowserRouter>
				<Provider store={store}>
					<CssBaseline />
					<App />
				</Provider>
			</BrowserRouter>
		</ErrorBoundary>
	</React.StrictMode>,
);
