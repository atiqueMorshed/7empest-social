import { DarkModePalette, LightModePalette } from "./themeMode";
import typography from "./typography";

export const themeSettings = (mode) => {
	return {
		palette: {
			mode: mode,
			...(mode === "dark" ? DarkModePalette : LightModePalette),
		},
		typography: typography,
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						scrollbarColor: "#6b6b6b #2b2b2b",
						"&::-webkit-scrollbar, & *::-webkit-scrollbar": {
							backgroundColor: mode === "dark" ? "#1a1a1b" : "#fff",
						},
						"&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
							borderRadius: 8,
							backgroundColor: mode === "dark" ? "#282A3A" : "#E4DCCF",
							minHeight: 24,
							border: `3px solid ${mode === "dark" ? "#1a1a1b" : "#fff"}`,
						},
						"&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
							{
								backgroundColor: "#959595",
							},
						"&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
							{
								backgroundColor: "#959595",
							},
						"&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
							{
								backgroundColor: "#959595",
							},
						"&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
							backgroundColor: "#2b2b2b",
						},
					},
				},
			},
			MuiMenu: {
				styleOverrides: {
					list: {
						// eslint-disable-next-line quotes
						'&[role="menu"]': {
							backgroundColor: mode === "dark" ? "#1a1a1b" : "#fff",
						},
					},
				},
			},
		},
	};
};
