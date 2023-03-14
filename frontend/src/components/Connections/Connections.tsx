import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/authSlice";
import LoadingPage from "../LoadingPage/LoadingPage";

const Connections = () => {
	const user = useAppSelector(selectUser);
	const [value, setValue] = useState("followers");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	if (user) {
		return (
			<Box
				sx={{
					padding: "1rem",
					backgroundColor: "background.paper",
					borderRadius: "0.5rem",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "1rem",
				}}
			>
				<Tabs
					value={value}
					onChange={handleChange}
					textColor="primary"
					indicatorColor="primary"
					aria-label="Connections"
				>
					<Tab value="followers" label="Followers" />
					<Tab value="followings" label="Followings" />
				</Tabs>
				<Scrollbars style={{ height: "60vh" }} autoHide autoHideTimeout={2000}>
					<Box
						sx={{
							padding: "1rem",
							backgroundColor: "background.paper",
							borderRadius: "0.5rem",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "1rem",
						}}
					>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
						<Typography variant="h1">XD</Typography>
					</Box>
				</Scrollbars>
			</Box>
		);
	}
	return <LoadingPage />;
};

export default Connections;
