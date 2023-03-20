import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetFollowersQuery } from "../../features/users/usersApi";
import PersonCard from "../Navbar/SearchPeople/PersonCard";

type iProps = {
	username: string;
};

const Followers = ({ username }: iProps) => {
	const { isLoading, isSuccess, data } = useGetFollowersQuery(username);
	let content;

	if (isLoading) {
		content = (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
					gap: "1rem",
					width: { xs: "100%", sm: "300px" },
					pl: 2,
				}}
			>
				<CircularProgress sx={{ color: "primary.light" }} />
			</Box>
		);
	} else if (
		isSuccess &&
		data?.user?.followers &&
		data?.user?.followers?.length > 0
	) {
		content = (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "start",
					gap: "1rem",
					width: { xs: "100%", sm: "300px" },
					pl: 2,
				}}
			>
				{data.user.followers.map((fUser, idx) => (
					<PersonCard
						key={fUser?._id}
						user={fUser}
						fromConnection={true}
						isLastIndex={
							data?.user?.followers && data.user.followers.length - 1 === idx
						}
					/>
				))}
			</Box>
		);
	} else {
		content = (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
					gap: "1rem",
					width: { xs: "100%", sm: "300px" },
					pl: 2,
				}}
			>
				<Typography variant="h4">No followers found.</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				mt: "1rem",
				// height: "70vh",
				overflowY: "auto",
				overflowX: "hidden",
			}}
		>
			{content}
		</Box>
	);
};

export default Followers;
