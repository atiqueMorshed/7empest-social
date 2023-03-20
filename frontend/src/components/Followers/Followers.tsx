import {
	Box,
	CircularProgress,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch } from "../../app/hooks";
import usersApi, { useGetFollowersQuery } from "../../features/users/usersApi";
import PersonCard from "../Navbar/SearchPeople/PersonCard";

type iProps = {
	username: string;
};

const Followers = ({ username }: iProps) => {
	const theme = useTheme();
	const [height, setHeight] = useState("612px");

	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(5);

	const [hasMore, setHasMore] = useState(false);

	const dispatch = useAppDispatch();

	const { isLoading, isSuccess, data } = useGetFollowersQuery(username);

	const isBelowLG = useMediaQuery(theme.breakpoints.down("lg"));

	useEffect(() => {
		if (isBelowLG) setHeight("466px");
		else setHeight("612px");
	}, [isBelowLG]);

	useEffect(() => {
		if (page > 0)
			dispatch(
				usersApi.endpoints.getMoreFollowers.initiate({ username, page }),
			);
	}, [dispatch, page, username]);

	useEffect(() => {
		let lim;
		try {
			lim = parseInt(
				process.env.REACT_APP_FOLLOWERS_FOLLOWINGS_LIMIT_PER_PAGE || "10",
			);
		} catch (error) {
			lim = 10;
		}
		setLimit(lim);
	}, []);

	useEffect(() => {
		if (data?.totalFollowers && data?.totalFollowers > 0) {
			const maxPages = Math.floor(data.totalFollowers / limit);
			setHasMore(maxPages > page);
		} else {
			setHasMore(false);
		}
	}, [data?.totalFollowers, limit, page]);

	const fetchMore = () => {
		if (hasMore) setPage((prev) => prev + 1);
	};

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
			<InfiniteScroll
				dataLength={data?.totalFollowers || 0}
				next={fetchMore}
				hasMore={hasMore}
				loader={
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							py: "1rem",
						}}
					>
						<CircularProgress />
					</Box>
				}
				height={height}
			>
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
			</InfiniteScroll>
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
