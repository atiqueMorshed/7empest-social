import { DarkModePalette, LightModePalette } from "./themeMode";
import typography from "./typography";

export const themeSettings = (mode) => {
	return {
		palette: {
			mode: mode,
			...(mode === "dark" ? DarkModePalette : LightModePalette),
		},
		typography: typography,
	};
};
