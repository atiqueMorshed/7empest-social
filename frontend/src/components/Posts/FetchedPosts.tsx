import { Box, CircularProgress, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import postsApi, { useGetPostsQuery } from "../../features/posts/postsApi";
import { selectFilters } from "../../features/posts/postsSlice";
import Post from "./Post/Post";

const FetchedPosts = () => {
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(5);

	const [hasMore, setHasMore] = useState(false);

	const dispatch = useAppDispatch();
	const filters = useAppSelector(selectFilters);

	const { isSuccess, isLoading, data } = useGetPostsQuery(filters);

	useEffect(() => {
		if (page > 0)
			dispatch(postsApi.endpoints.getMorePosts.initiate({ page, ...filters }));
	}, [dispatch, filters, page]);

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
		if (data?.totalPosts && data?.totalPosts > 0) {
			const maxPages = Math.ceil(data.totalPosts / limit);
			setHasMore(maxPages > page);
		} else {
			setHasMore(false);
		}
	}, [data?.totalPosts, limit, page]);

	const fetchMore = () => {
		if (hasMore) setPage((prev) => prev + 1);
	};

	let content;
	if (isLoading) {
		content = (
			<Box
				sx={{
					backgroundColor: "background.paper",
					borderRadius: "0.5rem",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					p: "3rem",
				}}
			>
				<CircularProgress sx={{ color: "primary.light" }} />
			</Box>
		);
	} else if (isSuccess && data?.posts && data?.posts?.length > 0) {
		content = (
			<InfiniteScroll
				dataLength={data?.totalPosts || 0}
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
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "2rem",
						width: { xs: "300px", md: "550px" },
					}}
				>
					{data.posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</Box>
			</InfiniteScroll>
		);
	} else {
		content = (
			<Box
				sx={{
					backgroundColor: "background.paper",
					borderRadius: "0.5rem",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					p: "3rem",
				}}
			>
				<Typography variant="h4">No posts found.</Typography>
			</Box>
		);
	}

	return content;
};

export default FetchedPosts;
