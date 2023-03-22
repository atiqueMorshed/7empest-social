import { Box, Divider, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/authSlice";
import Followers from "../Followers/Followers";
import Followings from "../Followings/Followings";
import LoadingPage from "../LoadingPage/LoadingPage";

const Connections = () => {
	const user = useAppSelector(selectUser);
	const [value, setValue] = useState("followers");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	if (user?._id) {
		return (
			<Box
				sx={{
					backgroundColor: "background.paper",
					borderRadius: "0.5rem",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "1rem",
					pt: "1rem",
					height: "100%",
					top: 113 /* sticky needs top positioning to work*/,
					position: "sticky",
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
				<Box
					sx={{
						p: { sm: "1rem" },
						backgroundColor: "background.paper",
						borderRadius: "0.5rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Divider sx={{ width: "100%" }} />
					{value === "followers" ? (
						<Followers username={user.username} />
					) : (
						<Followings username={user.username} />
					)}
				</Box>
			</Box>
		);
	}
	return <LoadingPage />;
};

export default Connections;
