import {
	Avatar,
	Box,
	CircularProgress,
	Divider,
	Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useAppSelector } from "../../app/hooks";
import { useGetUserQuery } from "../../features/auth/authApi";
import { selectUser } from "../../features/auth/authSlice";

const ProfileColumn = () => {
	const { isLoading, data, isError } = useGetUserQuery("getUser");
	const selectedUser = useAppSelector(selectUser);
	if (isLoading) {
		return (
			<Box
				sx={{
					backgroundColor: "background.paper",
					borderRadius: "0.5rem",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "1rem",
					pt: "1rem",
					width: { xs: "300px", md: "400px" },
					height: { xs: "579px", lg: "725px" },
					top: 113 /* sticky needs top positioning to work*/,
					position: "sticky",
				}}
			>
				<CircularProgress />
			</Box>
		);
	} else if (isError) {
		return (
			<Box
				sx={{
					backgroundColor: "background.paper",
					borderRadius: "0.5rem",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "1rem",
					pt: "1rem",
					width: { xs: "300px", md: "400px" },
					height: { xs: "579px", lg: "725px" },
					top: 113 /* sticky needs top positioning to work*/,
					position: "sticky",
				}}
			>
				<Typography sx={{ fontSize: "28px", fontWeight: 700 }}>
					There was an error!
				</Typography>
			</Box>
		);
	}
	return (
		<Box
			sx={{
				backgroundColor: "background.paper",
				borderRadius: "0.5rem",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				pt: "1rem",
				width: { xs: "300px", md: "400px" },
				height: { xs: "579px", lg: "725px" },
				top: 113 /* sticky needs top positioning to work*/,
				position: "sticky",
			}}
		>
			<Avatar
				alt="User Image"
				sx={{
					height: "140px",
					width: "140px",
					objectfit: "cover",
					borderRadius: 2,
					mt: 5,
				}}
				src={`http://localhost:4000/assets/avatar/${data?.user?.avatar}`}
			/>
			<Typography sx={{ fontSize: "28px", fontWeight: 700, mt: "1rem" }}>
				{data?.user?.firstname &&
					data?.user?.lastname &&
					data.user.firstname + " " + data.user.lastname}
			</Typography>
			<Typography
				sx={{ fontSize: "18px", fontWeight: 700, color: "primary.light" }}
			>
				@{data?.user?.username}
			</Typography>
			<Divider sx={{ width: "100%", mt: 6 }} />
			<Box
				sx={{
					display: "flex",
					gap: 3,
					height: "4rem",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					<Typography>FOLLOWERS:</Typography>
					<Typography sx={{ fontSize: "22px", fontWeight: 700 }}>
						{selectedUser?.followerTotal}
					</Typography>
				</Box>
				<Divider orientation="vertical" />
				<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
					<Typography>FOLLOWINGS:</Typography>
					<Typography sx={{ fontSize: "22px", fontWeight: 700 }}>
						{selectedUser?.followingTotal}
					</Typography>
				</Box>
			</Box>
			<Divider sx={{ width: "100%", mb: 6 }} />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 3,
					alignSelf: "start",
					pl: 5,
				}}
			>
				<Box
					sx={{
						display: "flex",
						gap: 1,
						alignItems: "center",
					}}
				>
					<Typography>LOCATION:</Typography>
					<Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
						{data?.user?.location}
					</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						gap: 1,
						alignItems: "center",
					}}
				>
					<Typography>OCCUPATION:</Typography>
					<Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
						{data?.user?.occupation}
					</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						gap: 1,
						alignItems: "center",
					}}
				>
					<Typography>Member Since:</Typography>
					<Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
						{data?.user?.joinDate &&
							format(new Date(data.user.joinDate), "MMMM, y")}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default ProfileColumn;
