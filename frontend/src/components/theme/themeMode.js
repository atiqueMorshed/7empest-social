import { blue, cyan, gold, green, grey, red } from "@ant-design/colors";
const contrastText = "#fff";

export const DarkModePalette = {
	background: {
		offset1: grey[10],
		offset2: "#262626",
		paper: "#1a1a1b",
		default: "#030303",
	},
	primary: {
		lighter: blue[0],
		100: blue[1],
		200: blue[2],
		light: blue[3],
		400: blue[4],
		main: blue[5],
		dark: blue[6],
		700: blue[7],
		darker: blue[8],
		900: blue[9],
		contrastText,
	},
	secondary: {
		lighter: grey[2],
		100: grey[2],
		200: grey[3],
		light: grey[4],
		400: grey[5],
		main: grey[6],
		600: grey[7],
		dark: grey[8],
		800: grey[9],
		darker: grey[10],
		A100: grey[0],
		A200: grey[13],
		A300: grey[14],
		contrastText: grey[0],
	},

	success: {
		lighter: green[0],
		100: green[1],
		200: green[2],
		light: green[3],
		main: green[5],
		500: green[6],
		dark: green[7],
		darker: green[9],
		contrastText,
	},
	warning: {
		lighter: gold[0],
		100: gold[1],
		200: gold[2],
		light: gold[3],
		main: gold[5],
		dark: gold[7],
		darker: gold[9],
		contrastText: grey[2],
	},
	error: {
		lighter: red[0],
		100: red[1],
		200: red[2],
		light: red[2],
		main: red[4],
		dark: red[7],
		darker: red[9],
		contrastText,
	},
	info: {
		lighter: cyan[0],
		100: cyan[1],
		200: cyan[2],
		light: cyan[3],
		main: cyan[5],
		dark: cyan[7],
		darker: cyan[9],
		contrastText,
	},
};

export const LightModePalette = {
	background: {
		offset1: "#EEEEEE",
		offset2: "#E8E8E8",
		default: "#fafafb",
		paper: "#ffffff",

		// paper: "#f4f4f4",
	},
	primary: {
		lighter: blue[0],
		100: blue[1],
		200: blue[2],
		light: blue[3],
		400: blue[4],
		main: blue[5],
		dark: blue[6],
		700: blue[7],
		darker: blue[8],
		900: blue[9],
		contrastText,
	},
	secondary: {
		lighter: grey[2],
		100: grey[2],
		200: grey[3],
		light: grey[4],
		400: grey[5],
		main: grey[6],
		600: grey[7],
		dark: grey[8],
		800: grey[9],
		darker: grey[10],
		A100: grey[0],
		A200: grey[13],
		A300: grey[14],
		contrastText: grey[0],
	},
	success: {
		lighter: green[0],
		100: green[1],
		200: green[2],
		light: green[3],
		main: green[5],
		500: green[6],
		dark: green[7],
		darker: green[9],
		contrastText,
	},
	warning: {
		lighter: gold[0],
		100: gold[1],
		200: gold[2],
		light: gold[3],
		main: gold[5],
		dark: gold[7],
		darker: gold[9],
		contrastText: grey[2],
	},
	error: {
		lighter: red[0],
		100: red[1],
		200: red[2],
		light: red[2],
		main: red[4],
		dark: red[7],
		darker: red[9],
		contrastText,
	},
	info: {
		lighter: cyan[0],
		100: cyan[1],
		200: cyan[2],
		light: cyan[3],
		main: cyan[5],
		dark: cyan[7],
		darker: cyan[9],
		contrastText,
	},
};

// export const DarkModePalette = {
// 	primary: {
// 		main: "#1890ff",
// 	},
// 	secondary: {
// 		main: "#ff4d4f",
// 	},
// 	background: {
// 		default: "#030303",
// 		paper: "#1a1a1b",
// 	},
// 	success: {
// 		// main: "#00845c",
// 		main: "#52C41A",
// 	},
// 	warning: {
// 		main: "#faad14",
// 	},
// };

// export const LightModePalette = {
// 	primary: {
// 		main: "#1890ff",
// 	},
// 	secondary: {
// 		main: "#ff4d4f",
// 	},
// 	background: {
// 		default: "#fafafb",
// 		// paper: "#f4f4f4",
// 		paper: "#ffffff",
// 	},
// 	success: {
// 		// main: "#00845c",
// 		main: "#52C41A",
// 	},
// 	warning: {
// 		main: "#faad14",
// 	},
// };
