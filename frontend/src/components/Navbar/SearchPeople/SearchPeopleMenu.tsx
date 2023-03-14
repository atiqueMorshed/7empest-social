import { Close } from "@mui/icons-material";
import {
	Box,
	CircularProgress,
	Divider,
	IconButton,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
// import InfiniteScroll from "react-infinite-scroller";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch } from "../../../app/hooks";
import usersApi, { useFindUsersQuery } from "../../../features/users/usersApi";
import PersonCard from "./PersonCard";

type iProps = {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const SearchPeopleMenu = ({ searchTerm, setSearchTerm }: iProps) => {
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(5);
	const [height, setHeight] = useState("80px");
	const [hasMore, setHasMore] = useState(false);

	const dispatch = useAppDispatch();

	const { isLoading, isSuccess, data } = useFindUsersQuery(searchTerm);

	useEffect(() => {
		if (page > 0)
			dispatch(usersApi.endpoints.findMoreUsers.initiate({ searchTerm, page }));
	}, [dispatch, page, searchTerm]);

	useEffect(() => {
		if (!isSuccess) setHeight("80px");

		if (data?.totalUsers && data.totalUsers > 0) {
			if (data.totalUsers >= 5) setHeight("437px");
			else setHeight(`${146 * data.totalUsers}px`);
		}
	}, [data, isSuccess]);

	useEffect(() => {
		let lim;
		try {
			lim = parseInt(process.env.REACT_APP_FIND_PEOPLE_LIMIT_PER_PAGE || "5");
		} catch (error) {
			lim = 5;
		}
		setLimit(lim);
	}, []);

	useEffect(() => {
		if (data?.totalUsers && data?.totalUsers > 0) {
			const maxPages = Math.floor(data.totalUsers / limit);
			setHasMore(maxPages > page);
		} else {
			setHasMore(false);
		}
	}, [data?.totalUsers, limit, page]);

	const fetchMore = () => {
		if (hasMore) setPage((prev) => prev + 1);
	};

	return (
		<Box
			sx={{
				backgroundColor: "background.offset2",
				borderRadius: 1,
				my: 1,
				mx: 2,
				position: { xs: "relative", sm: "absolute" },
				zIndex: 1101,
				top: { xs: 0, sm: 35 },
				left: { xs: -16, sm: -16 },
				p: "0.7rem 1rem 1.5rem 1rem",
				px: { xs: "1rem", sm: "2rem" },
				width: { xs: "250px", sm: "320px" },
			}}
		>
			<IconButton
				sx={{
					position: "absolute",
					top: 2,
					right: 2,
					display: { xs: "none", sm: "block" },
				}}
				onClick={() => setSearchTerm("")}
			>
				<Close />
			</IconButton>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "start",
					alignItems: "center",
					gap: "1rem",
				}}
			>
				<Typography
					sx={{
						fontSize: "14px",
						fontWeight: 700,
						alignSelf: "start",
						display: { xs: "none", sm: "block" },
					}}
				>
					Enter a search term.
				</Typography>
				<Divider style={{ width: "100%" }} />
				{!isSuccess && (
					<Typography sx={{ fontSize: "16px" }}>No users found!</Typography>
				)}
				{isLoading && <CircularProgress sx={{ color: "primary.light" }} />}
				{isSuccess && (
					<Scrollbars
						autoHide
						autoHideTimeout={2000}
						autoHeight
						autoHeightMax="50vh"
					>
						<InfiniteScroll
							dataLength={data?.users?.length || 0}
							next={fetchMore}
							hasMore={hasMore}
							loader={
								<div className="loader" key={0}>
									Loading ...
								</div>
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
								}}
							>
								{data?.users?.map((user) => (
									<PersonCard
										key={user?._id}
										user={user}
										setSearchTerm={setSearchTerm}
									/>
								))}
							</Box>
						</InfiniteScroll>
					</Scrollbars>
				)}
			</Box>
		</Box>
	);
};

export default SearchPeopleMenu;
